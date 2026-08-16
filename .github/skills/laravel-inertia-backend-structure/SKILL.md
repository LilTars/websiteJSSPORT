---
name: laravel-inertia-backend-structure
description: Backend structure conventions for Laravel Inertia applications, focusing on scalable, clean architecture, and maintainability. Use when scaffolding controllers, services, actions, models, or any core PHP backend logic in a Laravel Inertia project. Triggers on creating API endpoints, database queries, business logic implementations, handling form requests, or structuring Laravel backend code.
---

# Laravel Backend Structure Conventions

Based on expert-level, robust standards for structuring production Laravel backend applications, heavily influenced by Spatie's conventions and Domain-Driven Design principles.

## Core Architectural Principles

- **Thin Controllers, Fat Services/Actions:** Controllers should only handle HTTP logic (Requests, Validations, Responses). Business logic MUST be extracted.
- **Strict Typing:** Every function, method, and property MUST have strict type hints and return types. Avoid `mixed` where possible.
- **Single Responsibility:** Classes should do one thing well.
- **Clean Architecture:** "ไม่เขียนโค้ดมั่วซั่ว หรือวางโครงสร้างได้ตามใจ ต้องเข้าใจหลักการ สะอาด ถูกหลัก" - Adhere strictly to these principles.

## Directory Structure (Beyond Default Laravel)

Introduce specific directories within `app/` to organize complex logic:

```text
app/
├── Actions/                   # Single-action classes for specific business tasks
├── DataTransferObjects/       # Objects defining structure for data passing
├── Enums/                     # PHP 8.1+ Enums for fixed values/states
├── Exceptions/                # Custom application exceptions
├── Http/
│   ├── Controllers/
│   ├── Requests/              # FormRequests for validation
│   └── Resources/             # API/Inertia data transformation (if needed)
├── Models/                    # Eloquent Models
└── Services/                  # Classes managing complex, multi-step business logic
```

## Naming Conventions

- **Controllers:** PascalCase, suffixed with `Controller` (e.g., `OrderController`).
- **Actions:** PascalCase, verb-first (e.g., `CreateOrderAction`, `CalculatePriceAction`).
- **Services:** PascalCase, suffixed with `Service` (e.g., `PaymentService`).
- **Models:** PascalCase, singular (e.g., `Order`, `Product`).
- **Variables/Properties:** camelCase (e.g., `$totalPrice`, `$userRole`).
- **Database Columns:** snake_case (e.g., `created_at`, `is_active`).

## Pattern Implementations

### 1. Controllers (Inertia focused)

Controllers must use `FormRequest` for validation. Return `Inertia::render()` for views or `redirect()` for mutations.

```php
use App\Actions\CreateOrderAction;
use App\Http\Requests\StoreOrderRequest;
use Illuminate\Http\RedirectResponse;

public function store(StoreOrderRequest $request, CreateOrderAction $createOrder): RedirectResponse
{
    $createOrder->execute($request->validated());

    return redirect()->route('orders.index')->with('success', 'Order created.');
}
```

```php
use Illuminate\Http\Request;

// Wrong: Logic in controller
public function store(Request $request)
{
    $request->validate([...]);
    $order = Order::create($request->all());
    // ... sending emails, etc.
}
```

### 2. Actions

Actions should encapsulate a single use case and expose one clear method (commonly `execute`).

```php
namespace App\Actions;

use App\Models\User;

class CreateUserAction
{
    public function execute(array $data): User
    {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
        ]);
    }
}
```

### 3. Models and Eloquent

- Always specify `$fillable` or `$guarded`.
- Keep scopes and relationships strictly within the Model.
- Cast attributes explicitly (e.g., `protected $casts = ['is_active' => 'boolean'];`).
- Do not put complex business logic in the Model.

## Inertia Data Sharing

When passing data to Inertia pages:

1. Avoid passing entire Eloquent collections directly if they contain sensitive or unnecessary data.
2. Use Laravel's `->map()` or API Resources to shape the data explicitly for the frontend.
3. Be mindful of data density, especially when building virtualized data tables or dashboards.

## Error Handling

- Do not use generic `try/catch` blocks in controllers unless catching a specific, expected exception.
- Rely on Laravel's global exception handler or create custom exceptions for specific domain errors (e.g., `InsufficientStockException`).

## Code Style and Formatting

- Strictly adhere to PSR-12 coding standards.
- Use early returns to avoid deep nesting (guard clauses).
- Keep methods short and focused.

```php
// Good: Early Return
public function process(User $user): void
{
    if (! $user->isActive()) {
        return;
    }

    // Process active user
}

// Bad: Deep nesting
public function process(User $user): void
{
    if ($user->isActive()) {
        // Process active user
    }
}
```

## PR Review Checklist (Backend)

Use this checklist during backend pull request reviews to enforce structure and architecture consistency.

### Do

- Ensure controllers stay thin: authorize, validate via `FormRequest`, call an `Action` or `Service`, return response.
- Ensure business logic lives in `Actions` or `Services`, not controllers.
- Ensure strict type hints and return types are present on methods and properties.
- Ensure database writes that span multiple tables are wrapped in `DB::transaction()`.
- Ensure models define `$fillable` or `$guarded` explicitly.
- Ensure model casts are explicit and correct.
- Ensure data passed to Inertia is intentionally shaped (resources, maps, DTOs) and excludes sensitive fields.
- Ensure expected domain errors are represented with specific custom exceptions.
- Ensure methods use guard clauses and avoid deep nesting.
- Ensure naming follows conventions (Controller, Action, Service suffixes; singular model names).

### Don't

- Do not place heavy business logic inside controllers.
- Do not rely on untyped arrays when a DTO or value object is more appropriate.
- Do not use broad `try/catch` in controllers for generic exception swallowing.
- Do not return raw models or full collections to Inertia when only partial fields are needed.
- Do not perform multi-step side effects without transactional safety where consistency matters.
- Do not hide side effects inside model accessors, mutators, or unrelated scopes.
- Do not introduce naming that breaks established Laravel and domain conventions.
