<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class RecaptchaService
{
    protected $secretKey;
    protected $verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';

    public function __construct()
    {
        $this->secretKey = config('services.recaptcha.secret');
    }

    public function verify($token, $ip = null)
    {
        if (config('app.env') === 'local' && !$this->secretKey) {
             // Bypass in local if key not set, or return true for internal testing
             // For STRICT implementation, fail if no key. But for dev experience:
             return true; 
        }

        $response = Http::asForm()->post($this->verifyUrl, [
            'secret' => $this->secretKey,
            'response' => $token,
            'remoteip' => $ip,
        ]);

        $body = $response->json();

        if ($body['success'] && $body['score'] >= 0.5) {
            return true;
        }

        return false;
    }
}
