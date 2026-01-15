<?php

namespace App\Http\Controllers;
use App\Models\Member;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        return response()->json([
            'total_members'    => Member::count(),
            'active_members'   => Member::where('status', 'active')->count(),
            'new_this_month'   => Member::where('join_date', '>=', Carbon::now()->startOfMonth())->count(),
            'basic_members'  => Member::where('membership_type', 'Basic')->count(),
            'standard_members'  => Member::where('membership_type', 'Standard')->count(),
            'premium_members'  => Member::where('membership_type', 'Premium')->count(),
        ]);
    }
}
