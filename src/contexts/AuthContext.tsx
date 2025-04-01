
import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  signUp: (email: string, password: string, userData?: any) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        // Defer fetching profile to avoid deadlocks
        if (newSession?.user) {
          setTimeout(() => {
            fetchProfile(newSession.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      // Use public.profiles which was created in the SQL migration
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        throw error;
      }

      setProfile(data);
    } catch (error: any) {
      console.error('Error fetching profile:', error.message);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      setIsLoading(true);
      
      // First check if the network is available
      try {
        await fetch('https://www.google.com', { 
          mode: 'no-cors',
          cache: 'no-store',
          method: 'HEAD',
          // Short timeout to quickly detect network issues
          signal: AbortSignal.timeout(3000)
        });
      } catch (error) {
        // Network is unavailable
        toast.error("Network error: Please check your internet connection and try again.");
        throw new Error("Network unavailable");
      }
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) {
        throw error;
      }

      toast.success("Signup successful! Please check your email for verification.");
    } catch (error: any) {
      if (error.message === "Network unavailable") {
        // Already handled above
      } else if (error.message?.includes("fetch")) {
        toast.error("Network error: Couldn't connect to authentication server. Please try again later.");
      } else {
        toast.error(`Signup failed: ${error.message}`);
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Check network connectivity first
      try {
        await fetch('https://www.google.com', { 
          mode: 'no-cors',
          cache: 'no-store',
          method: 'HEAD',
          signal: AbortSignal.timeout(3000)
        });
      } catch (error) {
        toast.error("Network error: Please check your internet connection and try again.");
        throw new Error("Network unavailable");
      }
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast.success("Logged in successfully!");
    } catch (error: any) {
      if (error.message === "Network unavailable") {
        // Already handled above
      } else if (error.message?.includes("fetch")) {
        toast.error("Network error: Couldn't connect to authentication server. Please try again later.");
      } else {
        toast.error(`Login failed: ${error.message}`);
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error(`Logout failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      profile, 
      isLoading, 
      signUp, 
      signIn, 
      signOut,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
