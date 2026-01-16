<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Member>
 */
class MemberFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->phoneNumber(),
            'membership_type' => $this->faker->randomElement(['Basic', 'Standard', 'Premium']),
            'join_date' => $this->faker->date(),
            'dob' => $this->faker->date(),
            'status' => $this->faker->randomElement(['active', 'inactive']),
        ];
    }
}
