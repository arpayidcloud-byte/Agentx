export interface User { id: string; role: 'owner'|'developer'|'viewer'; }
export class AuthService { async authenticate(t: string): Promise<User> { return {id:'u1',role:'owner'}; } }
