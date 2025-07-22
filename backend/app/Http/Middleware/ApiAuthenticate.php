<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as BaseAuthenticate;

class ApiAuthenticate extends BaseAuthenticate
{
    protected function redirectTo($request): ?string
    {
        // ✅ Prevent redirect for API-only apps
        return null;
    }
}
