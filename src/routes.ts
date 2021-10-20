import Router from 'express';
import { AuthenticateUserController } from './controllers/AuthenticateUserController';
import { CreateMessageController } from './controllers/CreateMessageController';
import { GetLastThreeMessagesController } from './controllers/GetLastThreeMessagesController';
import { UserProfileController } from './controllers/UserProfileController';
import { ensureAuthenticated } from './middlewares/ensureAuthenticated';

const router = Router();

router.get('/github', (req, res) => {
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`
  );
});

router.get('/signin/callback', (req, res) => {
  const { code } = req.query;

  return res.json(code);
});

router.get('/profile', ensureAuthenticated, new UserProfileController().handle);

router.get('/messages/last_three', new GetLastThreeMessagesController().handle);

router.post('/auth', new AuthenticateUserController().handle);

router.post('/messages', ensureAuthenticated, new CreateMessageController().handle);

export { router };
