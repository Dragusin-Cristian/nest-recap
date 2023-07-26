import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Session,
  // UseInterceptors,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CatDto } from './dto/cat.dto';
import { AuthService } from './auth.service';
import { Cat } from './entities/cat.entity';
import { CurrentCat } from './decorators/current-cat.decorator';
// import { CurrentCatInterceptor } from './interceptors/current-cat.interceptor';

@Controller('cats')
@Serialize(CatDto)
// @UseInterceptors(CurrentCatInterceptor)
export class CatsController {
  constructor(
    private readonly catsService: CatsService,
    private readonly authService: AuthService,
  ) {}

  @Post('/signup')
  async create(@Body() createCatDto: CreateCatDto, @Session() session: any) {
    const cat = await this.authService.signup(
      createCatDto.name,
      createCatDto.breed,
      createCatDto.password,
    );
    session.catId = cat.id;
    return cat;
  }

  //* The order of execution is: interceptor => decorator => req. handler
  //* if we woudn't use a decorator, but an interceptor straight away, we end up with more code here, and can be more code repeating.
  @Get('/whoami')
  whoami(@CurrentCat() cat: Cat) {
    return cat;
  }

  @Post('/signin')
  async signin(@Body() body: Partial<CreateCatDto>, @Session() session: any) {
    const cat = await this.authService.signin(body.name, body.password);
    session.catId = cat.id; //* cookie is the same as from signup, because we didn't change anything in the db
    return cat;
  }

  @Post('/signout')
  signout(@Session() session: any) {
    session.catId = null;
  }

  @Get()
  find(@Query('breed') breed: string) {
    return this.catsService.find(breed);
  }

  @Get()
  findAll() {
    return this.catsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log('handler is running');
    return this.catsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    return this.catsService.update(+id, updateCatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.catsService.remove(parseInt(id));
  }
}
