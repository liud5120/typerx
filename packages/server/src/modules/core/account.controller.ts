import {
  GET,
  Path,
  PathParam,
  POST,
  PUT,
  DELETE,
  QueryParam,
  Context,
  ServiceContext,
  Preprocessor,
} from 'typescript-rest';
import { Tags, Security } from 'typescript-rest-swagger';
import { Appearance, PaginateResponse } from './../../types/appearance';
import { AccountService } from './account.service';
import { Account } from './interfaces/account.interface';
import { validator } from '../../util/validator';
import {
  CreateAccountDto,
  EditAccountDto,
  AccountResponse,
} from './dto/account.dto';
import { ProfileResponse } from './dto/login.dto';
import { KeyValue } from '../../types/data.types';

/**
 * 帐号管理.
 */
@Tags('core')
@Path('/api/account')
export class AccountController {
  @Context context: ServiceContext;

  constructor(private readonly service = new AccountService()) { }

  /**
   * 创建帐号
   * @param entry 帐号信息
   */
  @POST
  async create(entry: CreateAccountDto): Promise<AccountResponse> {
    return this.service.create(entry);
  }

  /**
   * 更新帐号
   * @param entry 帐号信息
   */
  @PUT
  async update(entry: EditAccountDto): Promise<AccountResponse> {
    const admin: any = this.context.request.user;
    return this.service.update(entry, admin);
  }

  /**
   * 获取帐号管理界面配置信息.
   */
  @Path('config')
  @GET
  async getConfig(): Promise<Appearance> {
    return this.service.getAppearance();
  }

  /**
   * 按关键词查询账号
   *
   * @param {string} [keyword]
   * @returns {Promise<Account[]>}
   * @memberof AccountController
   */
  @Path('search')
  @GET
  async getAccountsByKeyword(
    @QueryParam('keyword') keyword?: string,
    @QueryParam('value') value?: string,
  ): Promise<KeyValue[]> {
    return this.service.search(keyword, value);
  }

  /**
   * 分页查询帐号数据
   * @param keyword 关键词
   */
  @Path('query')
  @GET
  async query(
    @QueryParam('keyword') keyword?: string,
    @QueryParam('page') page?: number,
    @QueryParam('size') size?: number,
    @QueryParam('sort') sort?: string
  ): Promise<PaginateResponse<AccountResponse[]>> {
    return this.service.query(keyword, page, size, sort);
  }

  /**
   * 帐户信息
   */
  @GET
  @Path('profile')
  async profile(): Promise<ProfileResponse> {
    return this.service.profile(this.context);
  }

  /**
   * 删除帐号
   * @param id 帐号编号
   */
  @Path(':id')
  @DELETE
  async remove(@PathParam('id') id: string): Promise<boolean> {
    return this.service.remove(id);
  }

  /**
   * 查询帐号
   * @param id 编号
   */
  @Path(':id')
  @GET
  async get(@PathParam('id') id: string): Promise<AccountResponse> {
    return this.service.get(id);
  }


}
