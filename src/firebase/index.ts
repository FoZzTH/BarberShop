import * as admin from 'firebase-admin';

import 'firebase/auth';
import { env } from 'src/env';

admin.initializeApp({
  credential: admin.credential.cert(env.firebase.serviceAccount),
  databaseURL: 'https://barbershop-53217.firebaseio.com',
});

export { admin };
