import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  db: SQLiteObject;
  databaseName: string = 'materna.db';

  constructor(private sqlite: SQLite, private sqlitePorter: SQLitePorter) { }

  async openDatabase() {
    try {
      this.db = await this.sqlite.create({ name: this.databaseName, location: 'default' });
      await this.createDatabase();
    } catch (error) {
      console.error('Ocorreu um erro ao criar o banco de dados', error);
    }
  }

  async createDatabase() {
    const sqlCreateDatabase = this.getCreateTable();
    const result = await this.sqlitePorter.importSqlToDb(this.db, sqlCreateDatabase);
    return result ? true : false;
  }

  getCreateTable() {
    const sqls = [];
    sqls.push('CREATE TABLE IF NOT EXISTS contacts (id integer primary key AUTOINCREMENT, nome varchar(255), cpf varchar(255), dataNascimento date, telefone varchar(255), email varchar(255), dataUltimaMenstruacao date, terminoPrimeiroTrimestre date, terminoSegundoTrimestre date, terminoTerceiroTrimestre date, telefoneEmergencia varchar(255));');
    sqls.push('CREATE TABLE IF NOT EXISTS consultas (id integer primary key AUTOINCREMENT, nome varchar(100), dataConsulta varchar(100), avaliacao varchar(100));');
    sqls.push('CREATE TABLE IF NOT EXISTS tarefas (id integer primary key AUTOINCREMENT, anotacoes varchar(100), sintoma1 booblean, sintoma2 booblean, sintoma3 booblean, sintoma4 booblean, sintoma5 booblean, sintoma6 booblean, sintoma7 booblean, sintoma8 booblean, sintoma9 booblean, sintoma10 booblean);');
    return sqls.join('\n');
  }

  async destroyDatabase() {
    try {
      await this.dropDatabase();
      await this.createDatabase();
    } catch (error) {
      console.error('Ocorreu um erro ao destruir o banco de dados', error);
    }
  }

  async dropDatabase() {
    const sqlDropDatabase = this.getDropTable();
    const result = await this.sqlitePorter.importSqlToDb(this.db, sqlDropDatabase);
    return result ? true : false;
  }

  getDropTable() {
    const sqls = [];
    sqls.push('DROP TABLE IF EXISTS contacts;');
    sqls.push('DROP TABLE IF EXISTS consultas;');
    sqls.push('DROP TABLE IF EXISTS tarefas;');
    return sqls.join('\n');
  }

  executeSQL(sql: string, params?: any[]) {
    return this.db.executeSql(sql, params);
  }
}
