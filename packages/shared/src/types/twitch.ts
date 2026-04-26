export type TwitchAuthToken = {
  access_token: string;
  expires_in: number;
  token_type: string;
};

export type TwitchUser = {
  id: string;
  login: string;
  display_name: string;
  type: string;
  broadcaster_type: string;
  description: string;
  profile_image_url: string;
  offline_image_url: string;
  view_count: number;
  created_at: string;
};

export type TwitchURLSearchParams = {
	anchor: 'component' | 'panel' | 'video_overlay';
	language: string;
	locale: string;
	mode: 'config' | 'dashboard' | 'viewer';
	platform: 'mobile' | 'web';
	popout: boolean;
	state:'testing' | 'hosted_test' | 'approved' | 'released' | 'ready_for_review' | 'in_review' | 'pending_action' | 'uploading';
};