export interface User {
  id: number;
  name: string;
  nickname: string;
  location: string;
  gender: string;
}
  

  export interface Post {
    id: number;
    user: User;
    content: string;
    votes: {
      upvotes: number;
      downvotes: number;
    };
    timestamp: string;
  }
  