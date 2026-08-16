---
name: laravel-inertia-backend-structure-th
user-invocable: false
description: แนวทางโครงสร้างฝั่ง Backend สำหรับ Laravel Inertia เน้นสถาปัตยกรรมที่สะอาด ขยายระบบได้ง่าย และดูแลรักษาได้ในระยะยาว ใช้เมื่อต้อง scaffold controller, service, action, model หรือเขียน business logic ฝั่ง PHP ในโปรเจกต์ Laravel Inertia
---

# แนวทางโครงสร้าง Backend สำหรับ Laravel Inertia

เอกสารนี้อิงมาตรฐานระดับ production โดยได้รับอิทธิพลจากแนวทางของ Spatie และหลักคิด Domain-Driven Design (DDD)

## หลักการสถาปัตยกรรมหลัก

- **Controller บาง, Service/Action หนา:** Controller จัดการเฉพาะ HTTP concerns (Request, Validation, Response) เท่านั้น
- **Strict Typing:** ทุก method, function และ property ต้องมี type hints และ return types ชัดเจน หลีกเลี่ยง `mixed` เท่าที่ทำได้
- **Single Responsibility:** 1 class ควรมีหน้าที่หลักเดียว
- **Clean Architecture:** ไม่เขียนโค้ดมั่วซั่ว หรือวางโครงสร้างตามใจ ต้องยึดหลักการที่สะอาดและตรวจสอบได้

## โครงสร้างโฟลเดอร์ที่แนะนำ (นอกเหนือจาก Laravel default)

```text
app/
├── Actions/                   # คลาสงานเดี่ยวสำหรับ use case เฉพาะ
├── DataTransferObjects/       # โครงสร้างข้อมูลสำหรับส่งต่อระหว่างเลเยอร์
├── Enums/                     # PHP 8.1+ Enums สำหรับค่าคงที่/สถานะ
├── Exceptions/                # Custom Exceptions ของโดเมน
├── Http/
│   ├── Controllers/
│   ├── Requests/              # FormRequest สำหรับ validation
│   └── Resources/             # แปลงข้อมูลก่อนส่ง API/Inertia
├── Models/                    # Eloquent Models
└── Services/                  # งานธุรกิจหลายขั้นตอนที่ซับซ้อน
```

## Naming Conventions

- **Controllers:** PascalCase และลงท้ายด้วย `Controller` เช่น `OrderController`
- **Actions:** PascalCase แบบขึ้นต้นด้วยคำกริยา เช่น `CreateOrderAction`, `CalculatePriceAction`
- **Services:** PascalCase และลงท้ายด้วย `Service` เช่น `PaymentService`
- **Models:** PascalCase แบบเอกพจน์ เช่น `Order`, `Product`
- **Variables/Properties:** camelCase เช่น `$totalPrice`, `$userRole`
- **Database Columns:** snake_case เช่น `created_at`, `is_active`

## ตัวอย่าง Pattern Implementation

### 1) Controllers (โฟกัส Inertia)

Controller ควรใช้ `FormRequest` สำหรับ validation และตอบกลับด้วย `Inertia::render()` (กรณี view) หรือ `redirect()` (กรณี mutation)

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

// ไม่ควร: ใส่ business logic ใน controller
public function store(Request $request)
{
    $request->validate([...]);
    $order = Order::create($request->all());
    // ... ส่งอีเมล, side effects อื่น ๆ
}
```

### 2) Actions

Action ควรครอบ use case เดียวและเปิด method หลักที่ชัดเจน (มักใช้ชื่อ `execute`)

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

### 3) Models และ Eloquent

- ต้องกำหนด `$fillable` หรือ `$guarded` เสมอ
- เก็บ relationships และ scopes ไว้ใน Model เท่านั้น
- กำหนด casts ให้ชัดเจน เช่น `protected $casts = ['is_active' => 'boolean'];`
- หลีกเลี่ยง business logic ซับซ้อนใน Model

## การส่งข้อมูลเข้า Inertia

เมื่อส่งข้อมูลไปหน้า Inertia:

1. หลีกเลี่ยงการส่ง Eloquent collection ทั้งก้อนโดยไม่คัดฟิลด์
2. ใช้ `->map()` หรือ API Resources เพื่อจัดรูปข้อมูลให้เหมาะกับ frontend
3. ระวังความหนาแน่นข้อมูล โดยเฉพาะหน้าตารางใหญ่และ dashboard

## Error Handling

- ไม่ใช้ `try/catch` แบบกว้างใน controller โดยไม่มีข้อยกเว้นที่คาดการณ์ชัดเจน
- ใช้ global exception handler ของ Laravel หรือ custom exceptions ระดับโดเมน เช่น `InsufficientStockException`

## Code Style และ Formatting

- ยึดมาตรฐาน PSR-12 อย่างเคร่งครัด
- ใช้ guard clauses เพื่อลด nested blocks
- เขียน method ให้สั้น ชัด และรับผิดชอบงานเดียว

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

## Do/Don't Checklist สำหรับรีวิว PR ฝั่ง Backend

### Do

- ตรวจว่า controller บางจริง: authorize + FormRequest + Action/Service + response
- ตรวจว่า business logic อยู่ใน Action/Service ไม่อยู่ใน controller
- ตรวจ strict typing ให้ครบทั้ง parameter และ return type
- ตรวจงานเขียนหลายตารางให้ครอบด้วย `DB::transaction()`
- ตรวจ `$fillable` หรือ `$guarded` ใน model
- ตรวจ casts ให้ชัดเจนและตรงชนิดข้อมูลจริง
- ตรวจข้อมูลที่ส่งให้ Inertia ว่าถูก shape แล้วและไม่มีข้อมูลเกินจำเป็น
- ตรวจ domain errors ให้ใช้ custom exception ที่สื่อความหมาย
- ตรวจ method ว่าใช้ guard clauses และไม่ nested ลึก
- ตรวจ naming conventions ให้คงเส้นคงวา

### Don't

- อย่าใส่ business logic หนา ๆ ใน controller
- อย่าใช้ array แบบไร้โครงสร้างในจุดที่ควรใช้ DTO
- อย่าใช้ `try/catch` กว้าง ๆ เพื่อกลืนข้อผิดพลาด
- อย่าส่ง model/collection ดิบทั้งหมดไป Inertia โดยไม่คัดฟิลด์
- อย่าทำ side effects หลายขั้นตอนโดยไม่ใช้ transaction เมื่อความถูกต้องข้อมูลสำคัญ
- อย่าซ่อน side effects ใน accessor/mutator/scope ที่ไม่เกี่ยวข้อง
- อย่าตั้งชื่อ class/method/ไฟล์ที่ขัดกับ convention ของระบบ
