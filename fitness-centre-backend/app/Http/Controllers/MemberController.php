<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Member;
use Illuminate\Support\Facades\Storage;

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
            'photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'status'          => 'nullable|string|in:active,inactive',
        ]);

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('members', 'public');
            $data['photo'] = $path;
        }

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
            'photo'           => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'remove_photo'    => 'nullable|string',
            'status'          => 'nullable|string|in:active,inactive',
        ]);

        if ($request->hasFile('photo')) {
            if ($member->photo) Storage::disk('public')->delete($member->photo);
            $data['photo'] = $request->file('photo')->store('members', 'public');
        } 
        elseif ($request->remove_photo === 'true') {
            if ($member->photo) Storage::disk('public')->delete($member->photo);
            $data['photo'] = null;
        } else {
            unset($data['photo']);
        }

        $member->update($data);

        return $member;
    }

    public function destroy(Member $member)
    {
        if ($member->photo) {
            Storage::disk('public')->delete($member->photo);
        }

        $member->delete();
        return response()->json(['message' => 'Member Deleted']);
    }
}