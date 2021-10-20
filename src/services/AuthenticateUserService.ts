import axios from 'axios';
import prismaClient from '../prisma';
import { Secret, sign } from 'jsonwebtoken';

interface IAcessTokenResponse {
  access_token: string;
}

interface IUserResponse {
  avatar_url: string;
  login: string;
  id: number;
  name: string;
}

class AuthenticateUserService {
  async execute(code: string) {
    const url = 'https://github.com/login/oauth/access_token';

    const { data } = await axios.post<IAcessTokenResponse>(url, null, {
      params: {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code
      },
      headers: {
        Accept: 'application/json'
      }
    });

    const response = await axios.get<IUserResponse>('https://api.github.com/user', {
      headers: {
        authorization: `Bearer ${data.access_token}`
      }
    });

    const { id, login, name, avatar_url } = response.data;

    let user = await prismaClient.user.findFirst({
      where: {
        name,
        login,
        github_id: id,
        avatar_url
      }
    });

    if (!user) {
      user = await prismaClient.user.create({
        data: {
          name,
          login,
          github_id: id,
          avatar_url
        }
      });
    }

    const jwt = sign(
      {
        user: {
          name: user.name,
          avatar_url: user.avatar_url,
          id: user.id
        }
      },
      process.env.JWT_SECRET as string,
      {
        subject: user.id,
        expiresIn: '1d'
      }
    );

    return { jwt, user };
  }
}

export { AuthenticateUserService };
