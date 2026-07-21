import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [AuthModule, UsersModule, ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env',
    }),MongooseModule.forRoot(process.env.DATABASE_URL ?? 'mongodb://localhost:27017/nestSecurity')
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
