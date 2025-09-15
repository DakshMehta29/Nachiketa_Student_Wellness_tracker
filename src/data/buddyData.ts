import { BuddyUser } from '../types';

// Fallback avatar generator
const generateAvatarUrl = (name: string, seed?: string) => {
  const avatarSeed = seed || name.toLowerCase().replace(/\s+/g, '');
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&size=150`;
};

export const sampleBuddies: BuddyUser[] = [
  {
    id: '1',
    name: 'Raju',
    age: 24,
    profilePicture: generateAvatarUrl('Raju', 'raju-fitness'),
    summary: 'Fitness enthusiast, loves morning runs and yoga',
    fitnessLevel: 'Advanced',
    activityTag: 'Running & Yoga',
    healthScore: 85,
    stressScore: 25,
    activityMatchPercentage: 92,
    location: 'Mumbai, India',
    interests: ['Running', 'Yoga', 'Meditation', 'Healthy Cooking'],
    lastActive: '2 hours ago'
  },
  {
    id: '2',
    name: 'Priya',
    age: 22,
    profilePicture: generateAvatarUrl('Priya', 'priya-wellness'),
    summary: 'Wellness coach, passionate about mental health',
    fitnessLevel: 'Expert',
    activityTag: 'Mental Wellness',
    healthScore: 90,
    stressScore: 15,
    activityMatchPercentage: 88,
    location: 'Delhi, India',
    interests: ['Meditation', 'Therapy', 'Journaling', 'Nature Walks'],
    lastActive: '1 hour ago'
  },
  {
    id: '3',
    name: 'Arjun',
    age: 26,
    profilePicture: generateAvatarUrl('Arjun', 'arjun-gym'),
    summary: 'Gym enthusiast, focused on strength training',
    fitnessLevel: 'Advanced',
    activityTag: 'Strength Training',
    healthScore: 88,
    stressScore: 30,
    activityMatchPercentage: 85,
    location: 'Bangalore, India',
    interests: ['Weightlifting', 'Protein Shakes', 'Sports', 'Gaming'],
    lastActive: '30 minutes ago'
  },
  {
    id: '4',
    name: 'Sneha',
    age: 23,
    profilePicture: generateAvatarUrl('Sneha', 'sneha-dance'),
    summary: 'Dance instructor, loves Zumba and cardio',
    fitnessLevel: 'Intermediate',
    activityTag: 'Dance & Cardio',
    healthScore: 82,
    stressScore: 20,
    activityMatchPercentage: 90,
    location: 'Chennai, India',
    interests: ['Dancing', 'Zumba', 'Music', 'Travel'],
    lastActive: '3 hours ago'
  },
  {
    id: '5',
    name: 'Vikram',
    age: 25,
    profilePicture: generateAvatarUrl('Vikram', 'vikram-cycling'),
    summary: 'Cycling enthusiast, outdoor adventure lover',
    fitnessLevel: 'Advanced',
    activityTag: 'Cycling & Adventure',
    healthScore: 87,
    stressScore: 18,
    activityMatchPercentage: 83,
    location: 'Pune, India',
    interests: ['Cycling', 'Hiking', 'Photography', 'Camping'],
    lastActive: '1 hour ago'
  },
  {
    id: '6',
    name: 'Kavya',
    age: 21,
    profilePicture: generateAvatarUrl('Kavya', 'kavya-yoga'),
    summary: 'Yoga practitioner, mindfulness advocate',
    fitnessLevel: 'Intermediate',
    activityTag: 'Yoga & Mindfulness',
    healthScore: 89,
    stressScore: 12,
    activityMatchPercentage: 95,
    location: 'Hyderabad, India',
    interests: ['Yoga', 'Meditation', 'Reading', 'Art'],
    lastActive: '4 hours ago'
  },
  {
    id: '7',
    name: 'Rohit',
    age: 27,
    profilePicture: generateAvatarUrl('Rohit', 'rohit-swimming'),
    summary: 'Swimming coach, water sports enthusiast',
    fitnessLevel: 'Expert',
    activityTag: 'Swimming & Water Sports',
    healthScore: 91,
    stressScore: 22,
    activityMatchPercentage: 87,
    location: 'Goa, India',
    interests: ['Swimming', 'Surfing', 'Beach Volleyball', 'Marine Life'],
    lastActive: '2 hours ago'
  },
  {
    id: '8',
    name: 'Ananya',
    age: 24,
    profilePicture: generateAvatarUrl('Ananya', 'ananya-pilates'),
    summary: 'Pilates instructor, core strength specialist',
    fitnessLevel: 'Advanced',
    activityTag: 'Pilates & Core',
    healthScore: 86,
    stressScore: 16,
    activityMatchPercentage: 89,
    location: 'Kolkata, India',
    interests: ['Pilates', 'Core Training', 'Healthy Eating', 'Fashion'],
    lastActive: '1 hour ago'
  }
];

export const getBuddyById = (id: string): BuddyUser | undefined => {
  return sampleBuddies.find(buddy => buddy.id === id);
};

export const getRandomBuddies = (count: number = 5): BuddyUser[] => {
  const shuffled = [...sampleBuddies].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
