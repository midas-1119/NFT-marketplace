import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(
        'mongodb+srv://gamereedb:IlVzobO19EZMJLyH@cluster0.cfbmt6f.mongodb.net/gameree',
      ),
  },
];
