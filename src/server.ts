import { httpServer, PORT, io } from './app';

httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
