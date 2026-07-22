import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [AuthModule, UsersModule, ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
  }), MongooseModule.forRoot(process.env.MONGODB_URI || ''), PaymentsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
