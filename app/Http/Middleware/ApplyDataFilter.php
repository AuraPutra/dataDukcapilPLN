<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApplyDataFilter
{
    /**
     * Handle an incoming request.
     *
     * Apply data filtering based on user's ul_up role:
     * - UIDRKR: No filter (access all data)
     * - UP3 xxx: Filter by nama_ap (from ui_up column)
     * - ULP xxx: Filter by nama_up (from ul_up column)
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check()) {
            $user = auth()->user();

            // Store filter info in request for use in controllers
            if ($user->isUidrkr()) {
                // UIDRKR - no filter
                $request->merge(['data_filter_type' => 'none']);
            } elseif ($user->isUp3()) {
                // UP3 - filter by nama_ap
                // Extract nama from "UP3 BANGKINANG" -> "BANGKINANG"
                $filterValue = preg_replace('/^UP3\s+/i', '', $user->ui_up);
                $request->merge([
                    'data_filter_type' => 'nama_ap',
                    'data_filter_value' => $filterValue
                ]);
            } elseif ($user->isUlp()) {
                // ULP - filter by nama_up
                // Extract nama from "ULP BANGKINANG" -> "BANGKINANG"
                $filterValue = preg_replace('/^ULP\s+/i', '', $user->ul_up);
                $request->merge([
                    'data_filter_type' => 'nama_up',
                    'data_filter_value' => $filterValue
                ]);
            } else {
                // Default: filter by nama_up
                $filterValue = preg_replace('/^ULP\s+/i', '', $user->ul_up);
                $request->merge([
                    'data_filter_type' => 'nama_up',
                    'data_filter_value' => $filterValue
                ]);
            }
        }

        return $next($request);
    }
}
