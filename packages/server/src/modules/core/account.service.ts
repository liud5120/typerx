import { Appearance } from "../../types/appearance";
import { ServiceContext, Errors } from "typescript-rest";
import { Account } from './interfaces/account.interfaces';
import { schema as AccountSchema } from './schemas/account';
import { CoreDatabase as Db } from './core.database';

export class AccountService {

    async getAppearance(): Promise<Appearance> {
        console.log('getAppearance', 'getAppearance...');
        return new Appearance();
    }

    async getAccountsByKeyword(keyword?: string): Promise<Account[]> {
        const query = keyword ? { name: new RegExp(keyword, 'i') } : {};
        const docs = await Db.Account.find(query).limit(25).exec();
        console.log('docs:', docs);
        return docs;
    }

    async create(entry: any): Promise<any> {
        const doc = new Db.Account(entry);
        return await doc.save();
    }

    async update(entry: any, admin?: Account): Promise<any> {

        if (admin && admin.isAdmin) {
            const doc = await Db.Account.findOneAndUpdate({
                _id: entry.id
            }, entry).exec();
            return doc;
        } else {
            throw new Errors.ForbiddenError('禁止非管理员更新账号信息！');
        }
    }

}