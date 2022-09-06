import { Injectable } from '@angular/core';
import { DatabaseService } from 'src/app/core/service/database.service';
import { Consulta } from './consulta';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {

  constructor(private db: DatabaseService) { }

  save(consulta: Consulta) {
    if (consulta.id > 0) {
      return this.update(consulta);
    } else {
      return this.insert(consulta);
    }
  }

  private insert(consulta: Consulta) {
    const sql = 'insert into consultas (nome, dataConsulta, avaliacao) values (?,?,?)';
    const data = [consulta.nome, consulta.dataConsulta, consulta.avaliacao];

    return this.db.executeSQL(sql, data);
  }

  private update(consulta: Consulta) {
    const sql = 'update consultas set nome = ?, dataConsulta = ?, avaliacao = ? where id = ?';
    const data = [consulta.nome, consulta.dataConsulta, consulta.avaliacao, consulta.id];

    return this.db.executeSQL(sql, data);
  }

  delete(id: number) {
    const sql = 'delete from consultas where id = ?';
    const data = [id];

    return this.db.executeSQL(sql, data);
  }

  async getById(id: number) {
    const sql = 'select * from consultas where id = ?';
    const data = [id];
    const result = await this.db.executeSQL(sql, data);
    const rows = result.rows;
    const consulta = new Consulta();
    if (rows && rows.length > 0) {
      const item = rows.item(0);
      consulta.id = item.id;
      consulta.nome = item.nome;
      consulta.dataConsulta = item.dataConsulta;
      consulta.avaliacao = item.avaliacao;
    }
    return consulta;
  }

  async getAll() {
    const sql = 'select * from consultas order by nome';
    const result = await this.db.executeSQL(sql);
    const consultas = this.fillConsultas(result.rows);
    return consultas;
  }

  async filter(text: string) {
    const sql = 'select * from consultas where nome like ? order by nome';
    const data = [`%${text}%`];
    const result = await this.db.executeSQL(sql, data);
    const consultas = this.fillConsultas(result.rows);
    return consultas;
  }

  private fillConsultas(rows: any) {
    const consultas: Consulta[] = [];

    for (let i = 0; i < rows.length; i++) {
      const item = rows.item(i);
      const consulta = new Consulta();
      consulta.id = item.id;
      consulta.nome = item.nome;
      consulta.dataConsulta = item.dataConsulta;
      consulta.avaliacao = item.avaliacao;
      consultas.push(consulta);
    }

    return consultas;
  }
}
