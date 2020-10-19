

export interface IGoogleUser {
    accessToken?: string;

    displayName: string;

    email: string;

    familyName?: string;

    givenName?: string;

    idToken?: string;

    imageUrl?: string;

    refreshToken?: string;

    serverAuthCode?: string;

    userId?: string;
}

export interface IUser extends IGoogleUser, firebase.UserInfo {
    isAdmin?: boolean;
    floor?: string;
    cardNumber?: string;
    transType?: string;
}
