<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'auth' => \App\Http\Middleware\ApiAuthenticate::class, // ✅ override default
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (Throwable $e, $request) {
            if ($request->is('api/*')) {
                if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenExpiredException) {
                    return \App\Helpers\ResponseHelper::error('Token has expired', [], 401);
                }

                if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenInvalidException) {
                    return \App\Helpers\ResponseHelper::error('Token is invalid', [], 401);
                }

                if ($e instanceof \Tymon\JWTAuth\Exceptions\JWTException) {
                    return \App\Helpers\ResponseHelper::error('Token is missing or not provided', [], 401);
                }

                if ($e instanceof \Illuminate\Auth\AuthenticationException) {
                    return \App\Helpers\ResponseHelper::error('Unauthenticated', [], 401);
                }

                $status = method_exists($e, 'getStatusCode') ? $e->getStatusCode() : 400;

                return \App\Helpers\ResponseHelper::error(
                    $e->getMessage(),
                    method_exists($e, 'errors') ? $e->errors() : [],
                    $status
                );
            }

            return null;
        });
    })
    ->create();
