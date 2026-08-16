<?php

namespace Tests\Feature;

use App\Enums\TeamRole;
use App\Models\Team;
use App\Models\TeamInvitation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    private function dashboardRoute(User $user): string
    {
        return route('dashboard', ['current_team' => $user->currentTeam?->slug ?? $user->personalTeam()->slug]);
    }

    public function test_guests_are_redirected_to_the_login_page()
    {
        $user = User::factory()->create();
        $team = $user->currentTeam;

        $response = $this->get(route('dashboard', ['current_team' => $user->currentTeam?->slug ?? $user->personalTeam()->slug]));
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_visit_the_dashboard()
    {
        $user = User::factory()->create();
        $team = $user->currentTeam;

        $response = $this
            ->actingAs($user)
            ->get($this->dashboardRoute($user));

        $response->assertOk();
    }

    public function test_dashboard_includes_pending_invitations_for_the_authenticated_user()
    {
        $owner = User::factory()->create(['name' => 'Taylor Otwell']);
        $invitedUser = User::factory()->create(['email' => 'invited@example.com']);
        $team = Team::factory()->create(['name' => 'Laravel Team']);

        $team->members()->attach($owner, ['role' => TeamRole::Owner->value]);

        $invitation = TeamInvitation::factory()->create([
            'team_id' => $team->id,
            'email' => 'invited@example.com',
            'invited_by' => $owner->id,
        ]);

        $response = $this
            ->actingAs($invitedUser)
            ->get(route('dashboard'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->has('pendingInvitations', 1)
            ->where('pendingInvitations.0.code', $invitation->code)
            ->where('pendingInvitations.0.inviterName', 'Taylor Otwell')
            ->where('pendingInvitations.0.team.name', 'Laravel Team')
            ->where('pendingInvitations.0.team.slug', $team->slug)
            ->missing('pendingInvitations.0.teamName'),
        );
    }

    public function test_dashboard_exposes_real_website_visit_data_from_sessions_when_available()
    {
        $user = User::factory()->create();

        DB::table('sessions')->insert([
            [
                'id' => 'session-1',
                'user_id' => $user->id,
                'ip_address' => '127.0.0.1',
                'user_agent' => 'Mozilla/5.0',
                'payload' => json_encode(['a' => 'b']),
                'last_activity' => now()->subDays(2)->getTimestamp(),
            ],
            [
                'id' => 'session-2',
                'user_id' => null,
                'ip_address' => '127.0.0.2',
                'user_agent' => 'Mozilla/5.0',
                'payload' => json_encode(['c' => 'd']),
                'last_activity' => now()->subDay()->getTimestamp(),
            ],
        ]);

        $response = $this
            ->actingAs($user)
            ->get($this->dashboardRoute($user));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->has('websiteVisits.series', 30)
            ->where('websiteVisits.hasData', true)
            ->where('websiteVisits.total', 2)
            ->where('websiteVisits.series.0.value', 0)
        );
    }

    public function test_dashboard_exposes_real_page_visitor_data_when_available()
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        DB::table('click_events')->insert([
            [
                'event_type' => 'page_view',
                'page' => 'home',
                'page_key' => 'home',
                'section' => null,
                'category_name' => null,
                'category_slug' => null,
                'product_id' => null,
                'product_name' => null,
                'user_id' => $user->id,
                'session_id' => 'home-session-1',
                'ip_address' => '127.0.0.1',
                'user_agent' => 'Mozilla/5.0',
                'referrer' => 'https://jssport.co.th/',
                'created_at' => now()->subDay(),
                'updated_at' => now()->subDay(),
            ],
            [
                'event_type' => 'page_view',
                'page' => 'home',
                'page_key' => 'home',
                'section' => null,
                'category_name' => null,
                'category_slug' => null,
                'product_id' => null,
                'product_name' => null,
                'user_id' => null,
                'session_id' => 'home-session-1',
                'ip_address' => '127.0.0.2',
                'user_agent' => 'Mozilla/5.0',
                'referrer' => 'https://jssport.co.th/',
                'created_at' => now()->subHours(2),
                'updated_at' => now()->subHours(2),
            ],
            [
                'event_type' => 'page_view',
                'page' => 'products',
                'page_key' => 'products',
                'section' => null,
                'category_name' => null,
                'category_slug' => null,
                'product_id' => null,
                'product_name' => null,
                'user_id' => $otherUser->id,
                'session_id' => 'products-session-2',
                'ip_address' => '127.0.0.3',
                'user_agent' => 'Mozilla/5.0',
                'referrer' => 'https://jssport.co.th/products',
                'created_at' => now()->subDay(),
                'updated_at' => now()->subDay(),
            ],
            [
                'event_type' => 'page_view',
                'page' => 'about',
                'page_key' => 'about',
                'section' => null,
                'category_name' => null,
                'category_slug' => null,
                'product_id' => null,
                'product_name' => null,
                'user_id' => $user->id,
                'session_id' => 'about-session-3',
                'ip_address' => '127.0.0.4',
                'user_agent' => 'Mozilla/5.0',
                'referrer' => 'https://jssport.co.th/about',
                'created_at' => now()->subHours(5),
                'updated_at' => now()->subHours(5),
            ],
            [
                'event_type' => 'page_view',
                'page' => 'careers',
                'page_key' => 'careers',
                'section' => null,
                'category_name' => null,
                'category_slug' => null,
                'product_id' => null,
                'product_name' => null,
                'user_id' => null,
                'session_id' => 'careers-session-4',
                'ip_address' => '127.0.0.5',
                'user_agent' => 'Mozilla/5.0',
                'referrer' => 'https://jssport.co.th/careers',
                'created_at' => now()->subHours(3),
                'updated_at' => now()->subHours(3),
            ],
            [
                'event_type' => 'page_view',
                'page' => 'contact',
                'page_key' => 'contact',
                'section' => null,
                'category_name' => null,
                'category_slug' => null,
                'product_id' => null,
                'product_name' => null,
                'user_id' => $user->id,
                'session_id' => 'contact-session-5',
                'ip_address' => '127.0.0.6',
                'user_agent' => 'Mozilla/5.0',
                'referrer' => 'https://jssport.co.th/contact',
                'created_at' => now()->subHours(1),
                'updated_at' => now()->subHours(1),
            ],
        ]);

        $response = $this
            ->actingAs($user)
            ->get($this->dashboardRoute($user));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('pageVisitors.hasData', true)
            ->where('pageVisitors.total', 5)
            ->where('pageVisitors.series.0.label', 'Home')
            ->where('pageVisitors.series.0.value', 1)
            ->where('pageVisitors.series.1.label', 'หน้าสินค้า')
            ->where('pageVisitors.series.1.value', 1)
            ->where('pageVisitors.series.2.label', 'เกี่ยวกับเรา')
            ->where('pageVisitors.series.2.value', 1)
            ->where('pageVisitors.series.3.label', 'ร่วมงานกับเรา')
            ->where('pageVisitors.series.3.value', 1)
            ->where('pageVisitors.series.4.label', 'ติดต่อเรา')
            ->where('pageVisitors.series.4.value', 1)
        );
    }

    public function test_dashboard_handles_missing_click_events_table_without_crashing()
    {
        $user = User::factory()->create();

        if (Schema::hasTable('click_events')) {
            Schema::drop('click_events');
        }

        $response = $this
            ->actingAs($user)
            ->get($this->dashboardRoute($user));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('pageVisitors.hasData', false)
            ->where('pageVisitors.total', 0)
            ->where('productCategoryClicks.hasData', false)
            ->where('productCategoryClicks.total', 0)
            ->where('topViewedProducts.hasData', false)
            ->where('topViewedProducts.total', 0)
        );
    }

    public function test_dashboard_does_not_include_accepted_invitations()
    {
        $owner = User::factory()->create();
        $invitedUser = User::factory()->create(['email' => 'invited@example.com']);
        $team = Team::factory()->create();

        $team->members()->attach($owner, ['role' => TeamRole::Owner->value]);

        TeamInvitation::factory()->accepted()->create([
            'team_id' => $team->id,
            'email' => 'invited@example.com',
            'invited_by' => $owner->id,
        ]);

        $response = $this
            ->actingAs($invitedUser)
            ->get($this->dashboardRoute($invitedUser));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->has('pendingInvitations', 0),
        );
    }

    public function test_dashboard_excludes_expired_invitations_without_deleting_them()
    {
        $owner = User::factory()->create();
        $invitedUser = User::factory()->create(['email' => 'invited@example.com']);
        $team = Team::factory()->create();

        $team->members()->attach($owner, ['role' => TeamRole::Owner->value]);

        $invitation = TeamInvitation::factory()->expired()->create([
            'team_id' => $team->id,
            'email' => 'invited@example.com',
            'invited_by' => $owner->id,
        ]);

        $response = $this
            ->actingAs($invitedUser)
            ->get($this->dashboardRoute($invitedUser));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->has('pendingInvitations', 0),
        );

        $this->assertDatabaseHas('team_invitations', [
            'id' => $invitation->id,
        ]);
    }

    public function test_dashboard_does_not_include_or_delete_other_users_invitations()
    {
        $owner = User::factory()->create();
        $invitedUser = User::factory()->create(['email' => 'invited@example.com']);
        $team = Team::factory()->create();

        $team->members()->attach($owner, ['role' => TeamRole::Owner->value]);

        $invitation = TeamInvitation::factory()->expired()->create([
            'team_id' => $team->id,
            'email' => 'someone@example.com',
            'invited_by' => $owner->id,
        ]);

        $response = $this
            ->actingAs($invitedUser)
            ->get($this->dashboardRoute($invitedUser));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->has('pendingInvitations', 0),
        );

        $this->assertDatabaseHas('team_invitations', [
            'id' => $invitation->id,
        ]);
    }
}
