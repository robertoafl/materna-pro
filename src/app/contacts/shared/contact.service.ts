import { Injectable } from '@angular/core';
import { DatabaseService } from 'src/app/core/service/database.service';
import { Contact } from './contact';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private db: DatabaseService) { }

  save(contact: Contact) {
    if (contact.id > 0) {
      return this.update(contact);
    } else {
      return this.insert(contact);
    }
  }

  private insert(contact: Contact) {
    const sql = 'insert into contacts (nome, cpf, dataNascimento, telefone, email, dataUltimaMenstruacao , terminoPrimeiroTrimestre, terminoSegundoTrimestre, terminoTerceiroTrimestre, telefoneEmergencia) values (?,?,?,?,?,?,?,?,?,?)';
    const data = [contact.nome, contact.cpf, contact.dataNascimento, contact.telefone, contact.email, contact.dataUltimaMenstruacao, contact.terminoPrimeiroTrimestre, contact.terminoSegundoTrimestre, contact.terminoTerceiroTrimestre, contact.telefoneEmergencia];

    return this.db.executeSQL(sql, data);
  }

  private update(contact: Contact) {
    const sql = 'update contacts set nome = ?, cpf = ?, dataNascimento = ?, telefone = ?, email = ?, dataUltimaMenstruacao = ?, terminoPrimeiroTrimestre = ?, terminoSegundoTrimestre = ?, terminoTerceiroTrimestre = ?, telefoneEmergencia = ? where id = ?';
    const data = [contact.nome, contact.cpf, contact.dataNascimento, contact.telefone, contact.email, contact.dataUltimaMenstruacao, contact.terminoPrimeiroTrimestre, contact.terminoSegundoTrimestre, contact.terminoTerceiroTrimestre, contact.telefoneEmergencia, contact.id];

    return this.db.executeSQL(sql, data);
  }

  delete(id: number) {
    const sql = 'delete from contacts where id = ?';
    const data = [id];

    return this.db.executeSQL(sql, data);
  }

  async getById(id: number) {
    const sql = 'select * from contacts where id = ?';
    const data = [id];
    const result = await this.db.executeSQL(sql, data);
    const rows = result.rows;
    const contact = new Contact();
    if (rows && rows.length > 0) {
      const item = rows.item(0);
      contact.id = item.id;
      contact.nome = item.nome;
      contact.cpf = item.cpf;
      contact.dataNascimento = item.dataNascimento;
      contact.telefone = item.telefone;
      contact.email = item.email;
      contact.dataUltimaMenstruacao = item.dataUltimaMenstruacao;
      contact.terminoPrimeiroTrimestre = item.terminoPrimeiroTrimestre;
      contact.terminoSegundoTrimestre = item.terminoSegundoTrimestre;
      contact.terminoTerceiroTrimestre = item.terminoTerceiroTrimestre;
      contact.telefoneEmergencia = item.telefoneEmergencia;
    }
    return contact;
  }

  async getAll() {
    const sql = 'select * from contacts';
    const result = await this.db.executeSQL(sql);
    const contacts = this.fillContacts(result.rows);
    return contacts;
  }

  async filter(text: string) {
    const sql = 'select * from contacts where nome like ?';
    const data = [`%${text}%`];
    const result = await this.db.executeSQL(sql, data);
    const contacts = this.fillContacts(result.rows);
    return contacts;
  }

  private fillContacts(rows: any) {
    const contacts: Contact[] = [];

    for (let i = 0; i < rows.length; i++) {
      const item = rows.item(i);
      const contact = new Contact();
      contact.id = item.id;
      contact.nome = item.nome;
      contact.cpf = item.cpf;
      contact.dataNascimento = item.dataNascimento;
      contact.telefone = item.telefone;
      contact.email = item.email;
      contact.dataUltimaMenstruacao = item.dataUltimaMenstruacao;
      contact.terminoPrimeiroTrimestre = item.terminoPrimeiroTrimestre;
      contact.terminoSegundoTrimestre = item.terminoSegundoTrimestre;
      contact.terminoTerceiroTrimestre = item.terminoTerceiroTrimestre;
      contact.telefoneEmergencia = item.telefoneEmergencia;
      contacts.push(contact);
    }

    return contacts;
  }
}
