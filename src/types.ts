export interface Testimonial {
	id: number;
	name: string;
	university: string;
	year: string;
	quote: string;
	avatar: string;
	rating: number;
}

export interface BuddyUser {
	id: string;
	name: string;
	age: number;
	profilePicture: string;
	summary: string;
	fitnessLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
	activityTag: string;
	healthScore: number;
	stressScore: number;
	activityMatchPercentage: number;
	location: string;
	interests: string[];
	lastActive: string;
}

export interface FriendRequest {
	id: string;
	fromUserId: string;
	toUserId: string;
	status: 'pending' | 'accepted' | 'declined';
	createdAt: Date;
}

export interface ChatMessage {
	id: string;
	senderId: string;
	receiverId: string;
	content: string;
	timestamp: Date;
	type: 'text' | 'image' | 'file';
}


