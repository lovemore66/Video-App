export interface Author {
  id: string;
  name: string;
  pictureUrl: string;
}

export interface Video {
  id: string;
  title: string;
  description?: string;
  createdDate: string;
  author: Author;
  url?: string;
  previewUrl: string;
}

export interface Reactions {
  id?: string;
  videoId: string;
  author?: Author;
  createdDate?: string;
  timeframe: number;
  imageUrl?: string;
  type: string;
  postedDate?: string;
  addedTime?: any;
}

export interface Tab {
  tabNumber: number;
  iconActive: string;
  iconInactive: string;
  altText: string;
}
