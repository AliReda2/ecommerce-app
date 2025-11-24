export interface Hero {
  id: string;
  title: string;
  titleColor?: string;
  subtitle: string;
  subtitleColor?: string;
  description: string;
  descriptionColor?: string;
  buttonText: string;
  buttonColor?: string;
  imageUrl: string;
  imageAlt: string;
  backgroundColor?: string;
  order: number;
  isActive: boolean;
}
export interface HeroResponse {
  data: Hero[];
  msg: string;
}

export interface SingleHeroResponse {
  data: Hero;
  msg: string;
}
