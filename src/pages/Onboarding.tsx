import React, { useState } from 'react';
import Header from '../components/Header';
import MotivationStories from '../components/MotivationStories';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, Trophy, Star, Target, Users, BookOpen } from 'lucide-react';

type PetKey = 'pet1' | 'pet2';

const Onboarding = () => {
	const [petKey, setPetKey] = useState<PetKey>('pet1');
	const [petName, setPetName] = useState('');
	const navigate = useNavigate();

	function save() {
		const trimmed = petName.trim();
		if (!trimmed) return;
		const profile = {
			name: trimmed,
			imageKey: petKey as PetKey,
			startDate: new Date().toISOString(),
			mood: 'neutral',
		};
		localStorage.setItem('petProfile', JSON.stringify(profile));
		navigate('/');
	}

	return (
		<div className="min-h-screen bg-white dark:bg-gray-900">
			<Header />
			
			{/* Gamification & Guided Modules Section */}
			<section className="py-20 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<div className="flex items-center justify-center gap-3 mb-4">
							<Gamepad2 className="w-10 h-10 text-purple-600" />
							<h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
								Gamification & <span className="text-purple-600">Guided Modules</span>
							</h1>
						</div>
						<p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
							Earn streaks, badges, and complete self-care journeys while building lasting wellness habits
						</p>
					</div>

					{/* Gamification Features */}
					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
						<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
							<Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
							<h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Achievement Badges</h3>
							<p className="text-gray-600 dark:text-gray-300">Unlock badges for completing wellness milestones and building consistent habits</p>
						</div>
						
						<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
							<Star className="w-12 h-12 text-blue-500 mx-auto mb-4" />
							<h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Streak Tracking</h3>
							<p className="text-gray-600 dark:text-gray-300">Build momentum with visual streak counters for daily wellness activities</p>
						</div>
						
						<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
							<Target className="w-12 h-12 text-green-500 mx-auto mb-4" />
							<h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Guided Journeys</h3>
							<p className="text-gray-600 dark:text-gray-300">Follow structured programs designed for specific wellness goals</p>
						</div>
						
						<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
							<Users className="w-12 h-12 text-purple-500 mx-auto mb-4" />
							<h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Community Challenges</h3>
							<p className="text-gray-600 dark:text-gray-300">Join group challenges and compete with friends for extra motivation</p>
						</div>
					</div>

					{/* Pet Companion Setup */}
					<div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 max-w-4xl mx-auto">
						<div className="text-center mb-8">
							<h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Choose Your Wellness Companion</h2>
							<p className="text-gray-600 dark:text-gray-300">Select a virtual pet that will grow and evolve as you build better wellness habits</p>
						</div>
						
						<div className="grid grid-cols-2 gap-6 mb-8">
							<button 
								onClick={() => setPetKey('pet1')} 
								className={`rounded-2xl border-2 p-6 text-center transition-all duration-300 ${
									petKey==='pet1' 
										? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
										: 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
								} bg-white dark:bg-gray-800`}
							>
								<div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 bg-gray-100 dark:bg-gray-700">
							<img src="/pets/pet-1.jpeg" alt="Pet 1" className="w-full h-full object-cover" />
						</div>
								<div className="font-semibold text-gray-800 dark:text-gray-100 text-lg">Luna</div>
								<div className="text-sm text-gray-600 dark:text-gray-300 mt-1">The Sleep Guardian</div>
					</button>
							
							<button 
								onClick={() => setPetKey('pet2')} 
								className={`rounded-2xl border-2 p-6 text-center transition-all duration-300 ${
									petKey==='pet2' 
										? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
										: 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
								} bg-white dark:bg-gray-800`}
							>
								<div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 bg-gray-100 dark:bg-gray-700">
							<img src="/pets/pet-2.jpeg" alt="Pet 2" className="w-full h-full object-cover" />
						</div>
								<div className="font-semibold text-gray-800 dark:text-gray-100 text-lg">Zephyr</div>
								<div className="text-sm text-gray-600 dark:text-gray-300 mt-1">The Energy Booster</div>
							</button>
						</div>
						
						<div className="max-w-md mx-auto">
							<label className="block text-gray-700 dark:text-gray-200 mb-2 font-medium">Name your companion</label>
							<input 
								value={petName} 
								onChange={(e)=>setPetName(e.target.value)} 
								placeholder="e.g., Coco, Buddy, Max..." 
								className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 mb-6 focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
							/>
							<button 
								onClick={save} 
								disabled={!petName.trim()} 
								className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium"
							>
								Start My Wellness Journey
					</button>
				</div>
			</div>
				</div>
			</section>

			{/* Motivation Stories Section */}
			<MotivationStories />
		</div>
	);
};

export default Onboarding;


