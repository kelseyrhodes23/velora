export type Profile = {
  id: string;
  name: string;
  age: number;
  bio: string;
  photo: any; // string (path or URL) or { uri }
  location?: string;
  gender?: string;
  interests?: string[];
  job?: string;
  education?: string;
}; 