<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Member;

class MemberController extends Controller
{
    public function index(Request $request)
    {
        $query = Member::query();

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // return Member::all();
        return $query->latest()->paginate(10)->withQueryString();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:members',
            'phone' => 'required',
            'membership_type' => 'required|in:Basic,Standard,Premium',
            'join_date' => 'required|date',
            'dob'             => 'nullable|date', 
            'status'          => 'nullable|string|in:active,inactive',
        ]);

        return Member::create($data);
    }

    public function show(Member $member)
    {
        return $member;
    }

    public function update(Request $request, Member $member)
    {
        $data = $request->validate([
            'name'            => 'required|string|max:255',
            'email'           => 'required|email|unique:members,email,' . $member->id,
            'phone'           => 'required',
            'membership_type' => 'required|in:Basic,Standard,Premium',
            'join_date' => 'required|date',

            'dob'             => 'nullable|date', 
            'status'          => 'nullable|string|in:active,inactive',
        ]);
        $member->update($data);

        return $member;
    }

    public function destroy(Member $member)
    {
        $member->delete();
        return response()->json(['message' => 'Member Deleted']);
    }
}