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
    const sql = 'insert into contacts (name, nomePreferido, cpf, dataNascimento, telefone, email, estahGravida, dataUltimaMenstruacao, telefoneEmergencia, aceite) values (?,?,?,?,?,?,?,?,?,?)';
    const data = [contact.name, contact.nomePreferido, contact.cpf, contact.dataNascimento, contact.telefone, contact.email, contact.estahGravida, contact.dataUltimaMenstruacao, contact.telefoneEmergencia, contact.aceite];

    return this.db.executeSQL(sql, data);
  }

  private update(contact: Contact) {
    const sql = 'update contacts set name = ?, nomePreferido = ?, cpf = ?, dataNascimento = ?, telefone = ?, email = ?, estahGravida = ?, dataUltimaMenstruacao = ?, telefoneEmergencia = ?, aceite = ? where id = ?';
    const data = [contact.name, contact.nomePreferido, contact.cpf, contact.dataNascimento, contact.telefone, contact.email, contact.estahGravida, contact.dataUltimaMenstruacao, contact.telefoneEmergencia, contact.aceite, contact.id];

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
      contact.name = item.name;
      contact.nomePreferido = item.nomePreferido;
      contact.cpf = item.cpf;
      contact.dataNascimento = item.dataNascimento;
      contact.telefone = item.telefone;
      contact.email = item.email;
      contact.estahGravida = item.estahGravida;
      contact.dataUltimaMenstruacao = item.dataUltimaMenstruacao;
      contact.telefoneEmergencia = item.telefoneEmergencia;
      contact.aceite = item.aceite;
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
    const sql = 'select * from contacts where name like ?';
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
      contact.name = item.name;
      contact.nomePreferido = item.nomePreferido;
      contact.cpf = item.cpf;
      contact.dataNascimento = item.dataNascimento;
      contact.telefone = item.telefone;
      contact.email = item.email;
      contact.estahGravida = item.estahGravida;
      contact.dataUltimaMenstruacao = item.dataUltimaMenstruacao;
      contact.telefoneEmergencia = item.telefoneEmergencia;
      contact.aceite = item.aceite;
      contacts.push(contact);
    }

    return contacts;
  }
}
