import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SignIn, SignUp, useUser } from '@clerk/clerk-react';
import { ArrowLeft, CheckCircle, Heart } from 'lucide-react';
import Header from '../components/Header';

const SignInPage = () => {
  const [isSignUp, setIsSignUp] = React.useState(false);
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  // If user is already signed in, redirect to homepage
  React.useEffect(() => {
    if (isLoaded && user) {
      navigate('/');
    }
  }, [isLoaded, user, navigate]);

  // Show loading state while checking authentication
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900">
        <Header />
        <section className="flex items-center justify-center min-h-[calc(100vh-120px)] pt-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading...</p>
          </div>
        </section>
      </div>
    );
  }

  // If user is signed in, show success message
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900">
        <Header />
        <section className="flex items-center justify-center min-h-[calc(100vh-120px)] pt-8">
          <div className="container mx-auto px-4 py-16 max-w-md">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                Welcome back!
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                You're already signed in as {user.fullName || user.emailAddresses[0]?.emailAddress}
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Go to Homepage
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

	return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900">
      <Header />
      <section className="flex items-center justify-center min-h-[calc(100vh-120px)] pt-8">
        <div className="container mx-auto px-4 py-16 max-w-lg">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8">
            {/* Header Section */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                  {isSignUp ? 'Join Nachiketa' : 'Welcome Back'}
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                {isSignUp ? 'Create your wellness account and start your journey' : 'Sign in to your Nachiketa account'}
              </p>
            </div>

            {/* Clerk Sign In/Sign Up Components */}
            <div className="flex justify-center">
              {isSignUp ? (
                <SignUp 
                  appearance={{
                    elements: {
                      formButtonPrimary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300',
                      card: 'shadow-none border-0 bg-transparent',
                      headerTitle: 'hidden',
                      headerSubtitle: 'hidden',
                      socialButtonsBlockButton: 'border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl py-3 px-4 transition-all duration-300',
                      formFieldInput: 'border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl py-3 px-4 transition-all duration-300',
                      formFieldLabel: 'text-gray-700 dark:text-gray-300 font-medium mb-2',
                      identityPreviewText: 'text-gray-600 dark:text-gray-300',
                      formFieldInputShowPasswordButton: 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200',
                      footerActionLink: 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium',
                      formFieldSuccessText: 'text-green-600 dark:text-green-400',
                      formFieldErrorText: 'text-red-600 dark:text-red-400',
                      formFieldWarningText: 'text-yellow-600 dark:text-yellow-400',
                    }
                  }}
                  afterSignUpUrl="/companion-selection"
                  signInUrl="/sign-in"
                />
              ) : (
                <SignIn 
                  appearance={{
                    elements: {
                      formButtonPrimary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300',
                      card: 'shadow-none border-0 bg-transparent',
                      headerTitle: 'hidden',
                      headerSubtitle: 'hidden',
                      socialButtonsBlockButton: 'border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl py-3 px-4 transition-all duration-300',
                      formFieldInput: 'border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl py-3 px-4 transition-all duration-300',
                      formFieldLabel: 'text-gray-700 dark:text-gray-300 font-medium mb-2',
                      identityPreviewText: 'text-gray-600 dark:text-gray-300',
                      formFieldInputShowPasswordButton: 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200',
                      footerActionLink: 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium',
                      formFieldSuccessText: 'text-green-600 dark:text-green-400',
                      formFieldErrorText: 'text-red-600 dark:text-red-400',
                      formFieldWarningText: 'text-yellow-600 dark:text-yellow-400',
                    }
                  }}
                  afterSignInUrl="/"
                  signUpUrl="/sign-in"
                />
              )}
            </div>

            {/* Toggle between Sign In/Sign Up */}
            <div className="mt-8 text-center">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-1 inline-flex">
                <button
                  onClick={() => setIsSignUp(false)}
                  className={`px-6 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    !isSignUp 
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm' 
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setIsSignUp(true)}
                  className={`px-6 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isSignUp 
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm' 
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Back to Home Link */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Link
                to="/"
                className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 text-sm transition-colors duration-300"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
	);
};

export default SignInPage;

