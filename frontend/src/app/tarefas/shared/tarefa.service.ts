import { Injectable } from '@angular/core';
import { DatabaseService } from 'src/app/core/service/database.service';
import { Tarefa } from './tarefa';

@Injectable({
  providedIn: 'root'
})
export class TarefaService {

  constructor(private db: DatabaseService) { }

  save(tarefa: Tarefa) {
    if (tarefa.id > 0) {
      return this.update(tarefa);
    } else {
      return this.insert(tarefa);
    }
  }

  private insert(tarefa: Tarefa) {
    const sql = 'insert into tarefas (anotacoes) values (?)';
    const data = [tarefa.anotacoes];

    return this.db.executeSQL(sql, data);
  }

  private update(tarefa: Tarefa) {
    const sql = 'update tarefas set anotacoes = ? where id = ?';
    const data = [tarefa.anotacoes, tarefa.id];

    return this.db.executeSQL(sql, data);
  }

  delete(id: number) {
    const sql = 'delete from tarefas where id = ?';
    const data = [id];

    return this.db.executeSQL(sql, data);
  }

  async getById(id: number) {
    const sql = 'select * from tarefas where id = ?';
    const data = [id];
    const result = await this.db.executeSQL(sql, data);
    const rows = result.rows;
    const tarefa = new Tarefa();
    if (rows && rows.length > 0) {
      const item = rows.item(0);
      tarefa.id = item.id;
      tarefa.anotacoes = item.anotacoes;      
    }
    return tarefa;
  }

  async getAll() {
    const sql = 'select * from tarefas order by anotacoes';
    const result = await this.db.executeSQL(sql);
    const tarefas = this.fillTarefas(result.rows);
    return tarefas;
  }

  async filter(text: string) {
    const sql = 'select * from tarefas where anotacoes like ? order by anotacoes';
    const data = [`%${text}%`];
    const result = await this.db.executeSQL(sql, data);
    const tarefas = this.fillTarefas(result.rows);
    return tarefas;
  }

  private fillTarefas(rows: any) {
    const tarefas: Tarefa[] = [];

    for (let i = 0; i < rows.length; i++) {
      const item = rows.item(i);
      const tarefa = new Tarefa();
      tarefa.id = item.id;
      tarefa.anotacoes = item.anotacoes;
      tarefas.push(tarefa);
    }

    return tarefas;
  }
}