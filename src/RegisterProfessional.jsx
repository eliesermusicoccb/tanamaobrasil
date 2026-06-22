import { useState, useRef } from "react";

// LISTA COMPLETA DE CIDADES BRASILEIRAS
const CIDADES_BRASIL = [
  // SÃO PAULO (SP)
  { nome: "Adamantina", uf: "SP" },
  { nome: "Adolfo", uf: "SP" },
  { nome: "Aguaí", uf: "SP" },
  { nome: "Agudos", uf: "SP" },
  { nome: "Alambari", uf: "SP" },
  { nome: "Alfredo Marcondes", uf: "SP" },
  { nome: "Altair", uf: "SP" },
  { nome: "Altinópolis", uf: "SP" },
  { nome: "Alto Alegre", uf: "SP" },
  { nome: "Alumínio", uf: "SP" },
  { nome: "Alvinlândia", uf: "SP" },
  { nome: "Americana", uf: "SP" },
  { nome: "Amparo", uf: "SP" },
  { nome: "Américo Brasiliense", uf: "SP" },
  { nome: "Américo de Campos", uf: "SP" },
  { nome: "Analândia", uf: "SP" },
  { nome: "Andradina", uf: "SP" },
  { nome: "Angatuba", uf: "SP" },
  { nome: "Anhembi", uf: "SP" },
  { nome: "Anhumas", uf: "SP" },
  { nome: "Aparecida", uf: "SP" },
  { nome: "Aparecida d'Oeste", uf: "SP" },
  { nome: "Apiaí", uf: "SP" },
  { nome: "Aramina", uf: "SP" },
  { nome: "Arandu", uf: "SP" },
  { nome: "Arapeí", uf: "SP" },
  { nome: "Araraquara", uf: "SP" },
  { nome: "Araras", uf: "SP" },
  { nome: "Araçariguama", uf: "SP" },
  { nome: "Araçatuba", uf: "SP" },
  { nome: "Araçoiaba da Serra", uf: "SP" },
  { nome: "Arco-Íris", uf: "SP" },
  { nome: "Arealva", uf: "SP" },
  { nome: "Areias", uf: "SP" },
  { nome: "Areiópolis", uf: "SP" },
  { nome: "Ariranha", uf: "SP" },
  { nome: "Artur Nogueira", uf: "SP" },
  { nome: "Arujá", uf: "SP" },
  { nome: "Aspásia", uf: "SP" },
  { nome: "Assis", uf: "SP" },
  { nome: "Atibaia", uf: "SP" },
  { nome: "Auriflama", uf: "SP" },
  { nome: "Avanhandava", uf: "SP" },
  { nome: "Avaré", uf: "SP" },
  { nome: "Avaí", uf: "SP" },
  { nome: "Bady Bassitt", uf: "SP" },
  { nome: "Balbinos", uf: "SP" },
  { nome: "Bananal", uf: "SP" },
  { nome: "Barbosa", uf: "SP" },
  { nome: "Bariri", uf: "SP" },
  { nome: "Barra Bonita", uf: "SP" },
  { nome: "Barra do Chapéu", uf: "SP" },
  { nome: "Barra do Turvo", uf: "SP" },
  { nome: "Barretos", uf: "SP" },
  { nome: "Barrinha", uf: "SP" },
  { nome: "Barueri", uf: "SP" },
  { nome: "Barão de Antonina", uf: "SP" },
  { nome: "Bastos", uf: "SP" },
  { nome: "Batatais", uf: "SP" },
  { nome: "Bauru", uf: "SP" },
  { nome: "Bebedouro", uf: "SP" },
  { nome: "Bento de Abreu", uf: "SP" },
  { nome: "Bernardino de Campos", uf: "SP" },
  { nome: "Bertioga", uf: "SP" },
  { nome: "Bilac", uf: "SP" },
  { nome: "Birigui", uf: "SP" },
  { nome: "Biritiba-Mirim", uf: "SP" },
  { nome: "Boa Esperança do Sul", uf: "SP" },
  { nome: "Bocaina", uf: "SP" },
  { nome: "Bofete", uf: "SP" },
  { nome: "Boituva", uf: "SP" },
  { nome: "Bom Jesus dos Perdões", uf: "SP" },
  { nome: "Bom Sucesso de Itararé", uf: "SP" },
  { nome: "Boracéia", uf: "SP" },
  { nome: "Borborema", uf: "SP" },
  { nome: "Borebi", uf: "SP" },
  { nome: "Borá", uf: "SP" },
  { nome: "Botucatu", uf: "SP" },
  { nome: "Bragança Paulista", uf: "SP" },
  { nome: "Braúna", uf: "SP" },
  { nome: "Brejo Alegre", uf: "SP" },
  { nome: "Brodowski", uf: "SP" },
  { nome: "Brotas", uf: "SP" },
  { nome: "Buri", uf: "SP" },
  { nome: "Buritama", uf: "SP" },
  { nome: "Buritizal", uf: "SP" },
  { nome: "Bálsamo", uf: "SP" },
  { nome: "Cabreúva", uf: "SP" },
  { nome: "Cabrália Paulista", uf: "SP" },
  { nome: "Cachoeira Paulista", uf: "SP" },
  { nome: "Caconde", uf: "SP" },
  { nome: "Cafelândia", uf: "SP" },
  { nome: "Caiabu", uf: "SP" },
  { nome: "Caieiras", uf: "SP" },
  { nome: "Caiuá", uf: "SP" },
  { nome: "Cajamar", uf: "SP" },
  { nome: "Cajati", uf: "SP" },
  { nome: "Cajobi", uf: "SP" },
  { nome: "Cajuru", uf: "SP" },
  { nome: "Campina do Monte Alegre", uf: "SP" },
  { nome: "Campinas", uf: "SP" },
  { nome: "Campo Limpo Paulista", uf: "SP" },
  { nome: "Campos Novos Paulista", uf: "SP" },
  { nome: "Campos do Jordão", uf: "SP" },
  { nome: "Cananéia", uf: "SP" },
  { nome: "Canas", uf: "SP" },
  { nome: "Canitar", uf: "SP" },
  { nome: "Capela do Alto", uf: "SP" },
  { nome: "Capivari", uf: "SP" },
  { nome: "Capão Bonito", uf: "SP" },
  { nome: "Caraguatatuba", uf: "SP" },
  { nome: "Carapicuíba", uf: "SP" },
  { nome: "Cardoso", uf: "SP" },
  { nome: "Casa Branca", uf: "SP" },
  { nome: "Castilho", uf: "SP" },
  { nome: "Catanduva", uf: "SP" },
  { nome: "Catiguá", uf: "SP" },
  { nome: "Caçapava", uf: "SP" },
  { nome: "Cedral", uf: "SP" },
  { nome: "Cerqueira César", uf: "SP" },
  { nome: "Cerquilho", uf: "SP" },
  { nome: "Cesário Lange", uf: "SP" },
  { nome: "Charqueada", uf: "SP" },
  { nome: "Chavantes", uf: "SP" },
  { nome: "Clementina", uf: "SP" },
  { nome: "Colina", uf: "SP" },
  { nome: "Colômbia", uf: "SP" },
  { nome: "Conchal", uf: "SP" },
  { nome: "Conchas", uf: "SP" },
  { nome: "Cordeirópolis", uf: "SP" },
  { nome: "Coroados", uf: "SP" },
  { nome: "Coronel Macedo", uf: "SP" },
  { nome: "Corumbataí", uf: "SP" },
  { nome: "Cosmorama", uf: "SP" },
  { nome: "Cosmópolis", uf: "SP" },
  { nome: "Cotia", uf: "SP" },
  { nome: "Cravinhos", uf: "SP" },
  { nome: "Cristais Paulista", uf: "SP" },
  { nome: "Cruzeiro", uf: "SP" },
  { nome: "Cruzália", uf: "SP" },
  { nome: "Cubatão", uf: "SP" },
  { nome: "Cunha", uf: "SP" },
  { nome: "Cássia dos Coqueiros", uf: "SP" },
  { nome: "Cândido Mota", uf: "SP" },
  { nome: "Cândido Rodrigues", uf: "SP" },
  { nome: "Descalvado", uf: "SP" },
  { nome: "Diadema", uf: "SP" },
  { nome: "Dirce Reis", uf: "SP" },
  { nome: "Divinolândia", uf: "SP" },
  { nome: "Dobrada", uf: "SP" },
  { nome: "Dois Córregos", uf: "SP" },
  { nome: "Dolcinópolis", uf: "SP" },
  { nome: "Dourado", uf: "SP" },
  { nome: "Dracena", uf: "SP" },
  { nome: "Duartina", uf: "SP" },
  { nome: "Dumont", uf: "SP" },
  { nome: "Echaporã", uf: "SP" },
  { nome: "Eldorado", uf: "SP" },
  { nome: "Elias Fausto", uf: "SP" },
  { nome: "Elisiário", uf: "SP" },
  { nome: "Embaúba", uf: "SP" },
  { nome: "Embu das Artes", uf: "SP" },
  { nome: "Embu-Guaçu", uf: "SP" },
  { nome: "Emilianópolis", uf: "SP" },
  { nome: "Engenheiro Coelho", uf: "SP" },
  { nome: "Espírito Santo do Pinhal", uf: "SP" },
  { nome: "Espírito Santo do Turvo", uf: "SP" },
  { nome: "Estiva Gerbi", uf: "SP" },
  { nome: "Estrela d'Oeste", uf: "SP" },
  { nome: "Estrela do Norte", uf: "SP" },
  { nome: "Euclides da Cunha Paulista", uf: "SP" },
  { nome: "Fartura", uf: "SP" },
  { nome: "Fernando Prestes", uf: "SP" },
  { nome: "Fernandópolis", uf: "SP" },
  { nome: "Fernão", uf: "SP" },
  { nome: "Ferraz de Vasconcelos", uf: "SP" },
  { nome: "Flora Rica", uf: "SP" },
  { nome: "Floreal", uf: "SP" },
  { nome: "Florínia", uf: "SP" },
  { nome: "Flórida Paulista", uf: "SP" },
  { nome: "Franca", uf: "SP" },
  { nome: "Francisco Morato", uf: "SP" },
  { nome: "Franco da Rocha", uf: "SP" },
  { nome: "Gabriel Monteiro", uf: "SP" },
  { nome: "Garça", uf: "SP" },
  { nome: "Gastão Vidigal", uf: "SP" },
  { nome: "Gavião Peixoto", uf: "SP" },
  { nome: "General Salgado", uf: "SP" },
  { nome: "Getulina", uf: "SP" },
  { nome: "Glicério", uf: "SP" },
  { nome: "Guaimbê", uf: "SP" },
  { nome: "Guaiçara", uf: "SP" },
  { nome: "Guapiara", uf: "SP" },
  { nome: "Guapiaçu", uf: "SP" },
  { nome: "Guaraci", uf: "SP" },
  { nome: "Guarani d'Oeste", uf: "SP" },
  { nome: "Guarantã", uf: "SP" },
  { nome: "Guararapes", uf: "SP" },
  { nome: "Guararema", uf: "SP" },
  { nome: "Guaratinguetá", uf: "SP" },
  { nome: "Guaraçaí", uf: "SP" },
  { nome: "Guareí", uf: "SP" },
  { nome: "Guariba", uf: "SP" },
  { nome: "Guarujá", uf: "SP" },
  { nome: "Guarulhos", uf: "SP" },
  { nome: "Guará", uf: "SP" },
  { nome: "Guatapará", uf: "SP" },
  { nome: "Guaíra", uf: "SP" },
  { nome: "Guzolândia", uf: "SP" },
  { nome: "Gália", uf: "SP" },
  { nome: "Herculândia", uf: "SP" },
  { nome: "Holambra", uf: "SP" },
  { nome: "Hortolândia", uf: "SP" },
  { nome: "Iacanga", uf: "SP" },
  { nome: "Iacri", uf: "SP" },
  { nome: "Iaras", uf: "SP" },
  { nome: "Ibaté", uf: "SP" },
  { nome: "Ibirarema", uf: "SP" },
  { nome: "Ibirá", uf: "SP" },
  { nome: "Ibitinga", uf: "SP" },
  { nome: "Ibiúna", uf: "SP" },
  { nome: "Icém", uf: "SP" },
  { nome: "Iepê", uf: "SP" },
  { nome: "Igarapava", uf: "SP" },
  { nome: "Igaratá", uf: "SP" },
  { nome: "Igaraçu do Tietê", uf: "SP" },
  { nome: "Iguape", uf: "SP" },
  { nome: "Ilha Comprida", uf: "SP" },
  { nome: "Ilha Solteira", uf: "SP" },
  { nome: "Ilhabela", uf: "SP" },
  { nome: "Indaiatuba", uf: "SP" },
  { nome: "Indiana", uf: "SP" },
  { nome: "Indiaporã", uf: "SP" },
  { nome: "Inúbia Paulista", uf: "SP" },
  { nome: "Ipaussu", uf: "SP" },
  { nome: "Iperó", uf: "SP" },
  { nome: "Ipeúna", uf: "SP" },
  { nome: "Ipiguá", uf: "SP" },
  { nome: "Iporanga", uf: "SP" },
  { nome: "Ipuã", uf: "SP" },
  { nome: "Iracemápolis", uf: "SP" },
  { nome: "Irapuru", uf: "SP" },
  { nome: "Irapuã", uf: "SP" },
  { nome: "Itaberá", uf: "SP" },
  { nome: "Itajobi", uf: "SP" },
  { nome: "Itaju", uf: "SP" },
  { nome: "Itanhaém", uf: "SP" },
  { nome: "Itapecerica da Serra", uf: "SP" },
  { nome: "Itapetininga", uf: "SP" },
  { nome: "Itapeva", uf: "SP" },
  { nome: "Itapevi", uf: "SP" },
  { nome: "Itapira", uf: "SP" },
  { nome: "Itapirapuã Paulista", uf: "SP" },
  { nome: "Itaporanga", uf: "SP" },
  { nome: "Itapura", uf: "SP" },
  { nome: "Itapuí", uf: "SP" },
  { nome: "Itaquaquecetuba", uf: "SP" },
  { nome: "Itararé", uf: "SP" },
  { nome: "Itariri", uf: "SP" },
  { nome: "Itatiba", uf: "SP" },
  { nome: "Itatinga", uf: "SP" },
  { nome: "Itaí", uf: "SP" },
  { nome: "Itaóca", uf: "SP" },
  { nome: "Itirapina", uf: "SP" },
  { nome: "Itirapuã", uf: "SP" },
  { nome: "Itobi", uf: "SP" },
  { nome: "Itu", uf: "SP" },
  { nome: "Itupeva", uf: "SP" },
  { nome: "Ituverava", uf: "SP" },
  { nome: "Itápolis", uf: "SP" },
  { nome: "Jaborandi", uf: "SP" },
  { nome: "Jaboticabal", uf: "SP" },
  { nome: "Jacareí", uf: "SP" },
  { nome: "Jaci", uf: "SP" },
  { nome: "Jacupiranga", uf: "SP" },
  { nome: "Jaguariúna", uf: "SP" },
  { nome: "Jales", uf: "SP" },
  { nome: "Jambeiro", uf: "SP" },
  { nome: "Jandira", uf: "SP" },
  { nome: "Jardinópolis", uf: "SP" },
  { nome: "Jarinu", uf: "SP" },
  { nome: "Jaú", uf: "SP" },
  { nome: "Jeriquara", uf: "SP" },
  { nome: "Joanópolis", uf: "SP" },
  { nome: "José Bonifácio", uf: "SP" },
  { nome: "João Ramalho", uf: "SP" },
  { nome: "Jumirim", uf: "SP" },
  { nome: "Jundiaí", uf: "SP" },
  { nome: "Junqueirópolis", uf: "SP" },
  { nome: "Juquitiba", uf: "SP" },
  { nome: "Juquiá", uf: "SP" },
  { nome: "Júlio Mesquita", uf: "SP" },
  { nome: "Lagoinha", uf: "SP" },
  { nome: "Laranjal Paulista", uf: "SP" },
  { nome: "Lavrinhas", uf: "SP" },
  { nome: "Lavínia", uf: "SP" },
  { nome: "Leme", uf: "SP" },
  { nome: "Lençóis Paulista", uf: "SP" },
  { nome: "Limeira", uf: "SP" },
  { nome: "Lindóia", uf: "SP" },
  { nome: "Lins", uf: "SP" },
  { nome: "Lorena", uf: "SP" },
  { nome: "Lourdes", uf: "SP" },
  { nome: "Louveira", uf: "SP" },
  { nome: "Lucianópolis", uf: "SP" },
  { nome: "Lucélia", uf: "SP" },
  { nome: "Luiziânia", uf: "SP" },
  { nome: "Lupércio", uf: "SP" },
  { nome: "Lutécia", uf: "SP" },
  { nome: "Luís Antônio", uf: "SP" },
  { nome: "Macatuba", uf: "SP" },
  { nome: "Macaubal", uf: "SP" },
  { nome: "Macedônia", uf: "SP" },
  { nome: "Magda", uf: "SP" },
  { nome: "Mairinque", uf: "SP" },
  { nome: "Mairiporã", uf: "SP" },
  { nome: "Manduri", uf: "SP" },
  { nome: "Marabá Paulista", uf: "SP" },
  { nome: "Maracaí", uf: "SP" },
  { nome: "Marapoama", uf: "SP" },
  { nome: "Marinópolis", uf: "SP" },
  { nome: "Mariápolis", uf: "SP" },
  { nome: "Martinópolis", uf: "SP" },
  { nome: "Marília", uf: "SP" },
  { nome: "Matão", uf: "SP" },
  { nome: "Mauá", uf: "SP" },
  { nome: "Mendonça", uf: "SP" },
  { nome: "Meridiano", uf: "SP" },
  { nome: "Mesópolis", uf: "SP" },
  { nome: "Miguelópolis", uf: "SP" },
  { nome: "Mineiros do Tietê", uf: "SP" },
  { nome: "Mira Estrela", uf: "SP" },
  { nome: "Miracatu", uf: "SP" },
  { nome: "Mirandópolis", uf: "SP" },
  { nome: "Mirante do Paranapanema", uf: "SP" },
  { nome: "Mirassol", uf: "SP" },
  { nome: "Mirassolândia", uf: "SP" },
  { nome: "Mococa", uf: "SP" },
  { nome: "Mogi Guaçu", uf: "SP" },
  { nome: "Mogi Mirim", uf: "SP" },
  { nome: "Mogi das Cruzes", uf: "SP" },
  { nome: "Mombuca", uf: "SP" },
  { nome: "Mongaguá", uf: "SP" },
  { nome: "Monte Alegre do Sul", uf: "SP" },
  { nome: "Monte Alto", uf: "SP" },
  { nome: "Monte Aprazível", uf: "SP" },
  { nome: "Monte Azul Paulista", uf: "SP" },
  { nome: "Monte Castelo", uf: "SP" },
  { nome: "Monte Mor", uf: "SP" },
  { nome: "Monteiro Lobato", uf: "SP" },
  { nome: "Monções", uf: "SP" },
  { nome: "Morro Agudo", uf: "SP" },
  { nome: "Morungaba", uf: "SP" },
  { nome: "Motuca", uf: "SP" },
  { nome: "Murutinga do Sul", uf: "SP" },
  { nome: "Nantes", uf: "SP" },
  { nome: "Narandiba", uf: "SP" },
  { nome: "Natividade da Serra", uf: "SP" },
  { nome: "Nazaré Paulista", uf: "SP" },
  { nome: "Neves Paulista", uf: "SP" },
  { nome: "Nhandeara", uf: "SP" },
  { nome: "Nipoã", uf: "SP" },
  { nome: "Nova Aliança", uf: "SP" },
  { nome: "Nova Campina", uf: "SP" },
  { nome: "Nova Canaã Paulista", uf: "SP" },
  { nome: "Nova Castilho", uf: "SP" },
  { nome: "Nova Europa", uf: "SP" },
  { nome: "Nova Granada", uf: "SP" },
  { nome: "Nova Guataporanga", uf: "SP" },
  { nome: "Nova Independência", uf: "SP" },
  { nome: "Nova Luzitânia", uf: "SP" },
  { nome: "Nova Odessa", uf: "SP" },
  { nome: "Novais", uf: "SP" },
  { nome: "Novo Horizonte", uf: "SP" },
  { nome: "Nuporanga", uf: "SP" },
  { nome: "Ocauçu", uf: "SP" },
  { nome: "Olímpia", uf: "SP" },
  { nome: "Onda Verde", uf: "SP" },
  { nome: "Oriente", uf: "SP" },
  { nome: "Orindiúva", uf: "SP" },
  { nome: "Orlândia", uf: "SP" },
  { nome: "Osasco", uf: "SP" },
  { nome: "Oscar Bressane", uf: "SP" },
  { nome: "Osvaldo Cruz", uf: "SP" },
  { nome: "Ourinhos", uf: "SP" },
  { nome: "Ouro Verde", uf: "SP" },
  { nome: "Ouroeste", uf: "SP" },
  { nome: "Pacaembu", uf: "SP" },
  { nome: "Palestina", uf: "SP" },
  { nome: "Palmares Paulista", uf: "SP" },
  { nome: "Palmeira d'Oeste", uf: "SP" },
  { nome: "Palmital", uf: "SP" },
  { nome: "Panorama", uf: "SP" },
  { nome: "Paraguaçu Paulista", uf: "SP" },
  { nome: "Paraibuna", uf: "SP" },
  { nome: "Paranapanema", uf: "SP" },
  { nome: "Paranapuã", uf: "SP" },
  { nome: "Parapuã", uf: "SP" },
  { nome: "Paraíso", uf: "SP" },
  { nome: "Pardinho", uf: "SP" },
  { nome: "Pariquera-Açu", uf: "SP" },
  { nome: "Parisi", uf: "SP" },
  { nome: "Patrocínio Paulista", uf: "SP" },
  { nome: "Paulicéia", uf: "SP" },
  { nome: "Paulistânia", uf: "SP" },
  { nome: "Paulo de Faria", uf: "SP" },
  { nome: "Paulínia", uf: "SP" },
  { nome: "Pederneiras", uf: "SP" },
  { nome: "Pedra Bela", uf: "SP" },
  { nome: "Pedranópolis", uf: "SP" },
  { nome: "Pedregulho", uf: "SP" },
  { nome: "Pedreira", uf: "SP" },
  { nome: "Pedrinhas Paulista", uf: "SP" },
  { nome: "Pedro de Toledo", uf: "SP" },
  { nome: "Penápolis", uf: "SP" },
  { nome: "Pereira Barreto", uf: "SP" },
  { nome: "Pereiras", uf: "SP" },
  { nome: "Peruíbe", uf: "SP" },
  { nome: "Piacatu", uf: "SP" },
  { nome: "Piedade", uf: "SP" },
  { nome: "Pilar do Sul", uf: "SP" },
  { nome: "Pindamonhangaba", uf: "SP" },
  { nome: "Pindorama", uf: "SP" },
  { nome: "Pinhalzinho", uf: "SP" },
  { nome: "Piquerobi", uf: "SP" },
  { nome: "Piquete", uf: "SP" },
  { nome: "Piracaia", uf: "SP" },
  { nome: "Piracicaba", uf: "SP" },
  { nome: "Piraju", uf: "SP" },
  { nome: "Pirajuí", uf: "SP" },
  { nome: "Pirangi", uf: "SP" },
  { nome: "Pirapora do Bom Jesus", uf: "SP" },
  { nome: "Pirapozinho", uf: "SP" },
  { nome: "Pirassununga", uf: "SP" },
  { nome: "Piratininga", uf: "SP" },
  { nome: "Pitangueiras", uf: "SP" },
  { nome: "Planalto", uf: "SP" },
  { nome: "Platina", uf: "SP" },
  { nome: "Poloni", uf: "SP" },
  { nome: "Pompéia", uf: "SP" },
  { nome: "Pongaí", uf: "SP" },
  { nome: "Pontal", uf: "SP" },
  { nome: "Pontalinda", uf: "SP" },
  { nome: "Pontes Gestal", uf: "SP" },
  { nome: "Populina", uf: "SP" },
  { nome: "Porangaba", uf: "SP" },
  { nome: "Porto Feliz", uf: "SP" },
  { nome: "Porto Ferreira", uf: "SP" },
  { nome: "Potim", uf: "SP" },
  { nome: "Potirendaba", uf: "SP" },
  { nome: "Poá", uf: "SP" },
  { nome: "Pracinha", uf: "SP" },
  { nome: "Pradópolis", uf: "SP" },
  { nome: "Praia Grande", uf: "SP" },
  { nome: "Pratânia", uf: "SP" },
  { nome: "Presidente Alves", uf: "SP" },
  { nome: "Presidente Bernardes", uf: "SP" },
  { nome: "Presidente Epitácio", uf: "SP" },
  { nome: "Presidente Prudente", uf: "SP" },
  { nome: "Presidente Venceslau", uf: "SP" },
  { nome: "Promissão", uf: "SP" },
  { nome: "Quadra", uf: "SP" },
  { nome: "Quatá", uf: "SP" },
  { nome: "Queiroz", uf: "SP" },
  { nome: "Queluz", uf: "SP" },
  { nome: "Quintana", uf: "SP" },
  { nome: "Rafard", uf: "SP" },
  { nome: "Rancharia", uf: "SP" },
  { nome: "Redenção da Serra", uf: "SP" },
  { nome: "Regente Feijó", uf: "SP" },
  { nome: "Reginópolis", uf: "SP" },
  { nome: "Registro", uf: "SP" },
  { nome: "Restinga", uf: "SP" },
  { nome: "Ribeira", uf: "SP" },
  { nome: "Ribeirão Bonito", uf: "SP" },
  { nome: "Ribeirão Branco", uf: "SP" },
  { nome: "Ribeirão Corrente", uf: "SP" },
  { nome: "Ribeirão Grande", uf: "SP" },
  { nome: "Ribeirão Pires", uf: "SP" },
  { nome: "Ribeirão Preto", uf: "SP" },
  { nome: "Ribeirão do Sul", uf: "SP" },
  { nome: "Ribeirão dos Índios", uf: "SP" },
  { nome: "Rifaina", uf: "SP" },
  { nome: "Rincão", uf: "SP" },
  { nome: "Rinópolis", uf: "SP" },
  { nome: "Rio Claro", uf: "SP" },
  { nome: "Rio Grande da Serra", uf: "SP" },
  { nome: "Rio das Pedras", uf: "SP" },
  { nome: "Riolândia", uf: "SP" },
  { nome: "Riversul", uf: "SP" },
  { nome: "Rosana", uf: "SP" },
  { nome: "Roseira", uf: "SP" },
  { nome: "Rubinéia", uf: "SP" },
  { nome: "Rubiácea", uf: "SP" },
  { nome: "Sabino", uf: "SP" },
  { nome: "Sagres", uf: "SP" },
  { nome: "Sales", uf: "SP" },
  { nome: "Sales Oliveira", uf: "SP" },
  { nome: "Salesópolis", uf: "SP" },
  { nome: "Salmourão", uf: "SP" },
  { nome: "Saltinho", uf: "SP" },
  { nome: "Salto", uf: "SP" },
  { nome: "Salto Grande", uf: "SP" },
  { nome: "Salto de Pirapora", uf: "SP" },
  { nome: "Sandovalina", uf: "SP" },
  { nome: "Santa Adélia", uf: "SP" },
  { nome: "Santa Albertina", uf: "SP" },
  { nome: "Santa Branca", uf: "SP" },
  { nome: "Santa Bárbara d'Oeste", uf: "SP" },
  { nome: "Santa Clara d'Oeste", uf: "SP" },
  { nome: "Santa Cruz da Conceição", uf: "SP" },
  { nome: "Santa Cruz da Esperança", uf: "SP" },
  { nome: "Santa Cruz das Palmeiras", uf: "SP" },
  { nome: "Santa Cruz do Rio Pardo", uf: "SP" },
  { nome: "Santa Ernestina", uf: "SP" },
  { nome: "Santa Fé do Sul", uf: "SP" },
  { nome: "Santa Gertrudes", uf: "SP" },
  { nome: "Santa Isabel", uf: "SP" },
  { nome: "Santa Lúcia", uf: "SP" },
  { nome: "Santa Maria da Serra", uf: "SP" },
  { nome: "Santa Mercedes", uf: "SP" },
  { nome: "Santa Rita d'Oeste", uf: "SP" },
  { nome: "Santa Rita do Passa Quatro", uf: "SP" },
  { nome: "Santa Rosa de Viterbo", uf: "SP" },
  { nome: "Santa Salete", uf: "SP" },
  { nome: "Santana da Ponte Pensa", uf: "SP" },
  { nome: "Santana de Parnaíba", uf: "SP" },
  { nome: "Santo Anastácio", uf: "SP" },
  { nome: "Santo André", uf: "SP" },
  { nome: "Santo Antônio da Alegria", uf: "SP" },
  { nome: "Santo Antônio de Posse", uf: "SP" },
  { nome: "Santo Antônio do Aracanguá", uf: "SP" },
  { nome: "Santo Antônio do Jardim", uf: "SP" },
  { nome: "Santo Antônio do Pinhal", uf: "SP" },
  { nome: "Santo Expedito", uf: "SP" },
  { nome: "Santos", uf: "SP" },
  { nome: "Santópolis do Aguapeí", uf: "SP" },
  { nome: "Sarapuí", uf: "SP" },
  { nome: "Sarutaiá", uf: "SP" },
  { nome: "Sebastianópolis do Sul", uf: "SP" },
  { nome: "Serra Azul", uf: "SP" },
  { nome: "Serra Negra", uf: "SP" },
  { nome: "Serrana", uf: "SP" },
  { nome: "Sertãozinho", uf: "SP" },
  { nome: "Sete Barras", uf: "SP" },
  { nome: "Severínia", uf: "SP" },
  { nome: "Silveiras", uf: "SP" },
  { nome: "Socorro", uf: "SP" },
  { nome: "Sorocaba", uf: "SP" },
  { nome: "Sud Mennucci", uf: "SP" },
  { nome: "Sumaré", uf: "SP" },
  { nome: "Suzano", uf: "SP" },
  { nome: "Suzanápolis", uf: "SP" },
  { nome: "São Bento do Sapucaí", uf: "SP" },
  { nome: "São Bernardo do Campo", uf: "SP" },
  { nome: "São Caetano do Sul", uf: "SP" },
  { nome: "São Carlos", uf: "SP" },
  { nome: "São Francisco", uf: "SP" },
  { nome: "São Joaquim da Barra", uf: "SP" },
  { nome: "São José da Bela Vista", uf: "SP" },
  { nome: "São José do Barreiro", uf: "SP" },
  { nome: "São José do Rio Pardo", uf: "SP" },
  { nome: "São José do Rio Preto", uf: "SP" },
  { nome: "São José dos Campos", uf: "SP" },
  { nome: "São João da Boa Vista", uf: "SP" },
  { nome: "São João das Duas Pontes", uf: "SP" },
  { nome: "São João de Iracema", uf: "SP" },
  { nome: "São João do Pau d'Alho", uf: "SP" },
  { nome: "São Lourenço da Serra", uf: "SP" },
  { nome: "São Luiz do Paraitinga", uf: "SP" },
  { nome: "São Manuel", uf: "SP" },
  { nome: "São Miguel Arcanjo", uf: "SP" },
  { nome: "São Paulo", uf: "SP" },
  { nome: "São Pedro", uf: "SP" },
  { nome: "São Pedro do Turvo", uf: "SP" },
  { nome: "São Roque", uf: "SP" },
  { nome: "São Sebastião", uf: "SP" },
  { nome: "São Sebastião da Grama", uf: "SP" },
  { nome: "São Simão", uf: "SP" },
  { nome: "São Vicente", uf: "SP" },
  { nome: "Tabapuã", uf: "SP" },
  { nome: "Tabatinga", uf: "SP" },
  { nome: "Taboão da Serra", uf: "SP" },
  { nome: "Taciba", uf: "SP" },
  { nome: "Taguaí", uf: "SP" },
  { nome: "Taiaçu", uf: "SP" },
  { nome: "Taiúva", uf: "SP" },
  { nome: "Tambaú", uf: "SP" },
  { nome: "Tanabi", uf: "SP" },
  { nome: "Tapiratiba", uf: "SP" },
  { nome: "Tapiraí", uf: "SP" },
  { nome: "Taquaral", uf: "SP" },
  { nome: "Taquaritinga", uf: "SP" },
  { nome: "Taquarituba", uf: "SP" },
  { nome: "Taquarivaí", uf: "SP" },
  { nome: "Tarabai", uf: "SP" },
  { nome: "Tarumã", uf: "SP" },
  { nome: "Tatuí", uf: "SP" },
  { nome: "Taubaté", uf: "SP" },
  { nome: "Tejupá", uf: "SP" },
  { nome: "Teodoro Sampaio", uf: "SP" },
  { nome: "Terra Roxa", uf: "SP" },
  { nome: "Tietê", uf: "SP" },
  { nome: "Timburi", uf: "SP" },
  { nome: "Torre de Pedra", uf: "SP" },
  { nome: "Torrinha", uf: "SP" },
  { nome: "Trabiju", uf: "SP" },
  { nome: "Tremembé", uf: "SP" },
  { nome: "Três Fronteiras", uf: "SP" },
  { nome: "Tuiuti", uf: "SP" },
  { nome: "Tupi Paulista", uf: "SP" },
  { nome: "Tupã", uf: "SP" },
  { nome: "Turiúba", uf: "SP" },
  { nome: "Turmalina", uf: "SP" },
  { nome: "Ubarana", uf: "SP" },
  { nome: "Ubatuba", uf: "SP" },
  { nome: "Ubirajara", uf: "SP" },
  { nome: "Uchoa", uf: "SP" },
  { nome: "União Paulista", uf: "SP" },
  { nome: "Uru", uf: "SP" },
  { nome: "Urupês", uf: "SP" },
  { nome: "Urânia", uf: "SP" },
  { nome: "Valentim Gentil", uf: "SP" },
  { nome: "Valinhos", uf: "SP" },
  { nome: "Valparaíso", uf: "SP" },
  { nome: "Vargem", uf: "SP" },
  { nome: "Vargem Grande Paulista", uf: "SP" },
  { nome: "Vargem Grande do Sul", uf: "SP" },
  { nome: "Vera Cruz", uf: "SP" },
  { nome: "Vinhedo", uf: "SP" },
  { nome: "Viradouro", uf: "SP" },
  { nome: "Vista Alegre do Alto", uf: "SP" },
  { nome: "Vitória Brasil", uf: "SP" },
  { nome: "Votorantim", uf: "SP" },
  { nome: "Votuporanga", uf: "SP" },
  { nome: "Várzea Paulista", uf: "SP" },
  { nome: "Zacarias", uf: "SP" },
  { nome: "Águas da Prata", uf: "SP" },
  { nome: "Águas de Lindóia", uf: "SP" },
  { nome: "Águas de Santa Bárbara", uf: "SP" },
  { nome: "Águas de São Pedro", uf: "SP" },
  { nome: "Álvares Florence", uf: "SP" },
  { nome: "Álvares Machado", uf: "SP" },
  { nome: "Álvaro de Carvalho", uf: "SP" },
  { nome: "Óleo", uf: "SP" },
  // RIO DE JANEIRO (RJ)
  { nome: "Rio de Janeiro", uf: "RJ" },
  { nome: "Niterói", uf: "RJ" },
  { nome: "Duque de Caxias", uf: "RJ" },
  { nome: "São Gonçalo", uf: "RJ" },
  { nome: "Nova Iguaçu", uf: "RJ" },
  { nome: "Campo Grande", uf: "RJ" },
  { nome: "Mesquita", uf: "RJ" },
  { nome: "Nilópolis", uf: "RJ" },
  { nome: "Volta Redonda", uf: "RJ" },
  { nome: "Petrópolis", uf: "RJ" },
  { nome: "Magé", uf: "RJ" },
  // MINAS GERAIS (MG)
  { nome: "Belo Horizonte", uf: "MG" },
  { nome: "Uberlândia", uf: "MG" },
  { nome: "Contagem", uf: "MG" },
  { nome: "Juiz de Fora", uf: "MG" },
  { nome: "Betim", uf: "MG" },
  { nome: "Montes Claros", uf: "MG" },
  { nome: "Governador Valadares", uf: "MG" },
  { nome: "Divinópolis", uf: "MG" },
  { nome: "Viçosa", uf: "MG" },
  { nome: "Uberaba", uf: "MG" },
  { nome: "Teófilo Otoni", uf: "MG" },
  // BAHIA (BA)
  { nome: "Salvador", uf: "BA" },
  { nome: "Feira de Santana", uf: "BA" },
  { nome: "Vitória da Conquista", uf: "BA" },
  { nome: "Camaçari", uf: "BA" },
  { nome: "Itabuna", uf: "BA" },
  { nome: "Jequié", uf: "BA" },
  { nome: "Alagoinhas", uf: "BA" },
  { nome: "Paulo Afonso", uf: "BA" },
  { nome: "Ilhéus", uf: "BA" },
  { nome: "Barreiras", uf: "BA" },
  // RIO GRANDE DO SUL (RS)
  { nome: "Porto Alegre", uf: "RS" },
  { nome: "Caxias do Sul", uf: "RS" },
  { nome: "Pelotas", uf: "RS" },
  { nome: "Santa Maria", uf: "RS" },
  { nome: "Novo Hamburgo", uf: "RS" },
  { nome: "Rio Grande", uf: "RS" },
  { nome: "Canoas", uf: "RS" },
  { nome: "Gravataí", uf: "RS" },
  { nome: "Viamão", uf: "RS" },
  { nome: "Sapucaia do Sul", uf: "RS" },
  // PARANÁ (PR)
  { nome: "Curitiba", uf: "PR" },
  { nome: "Londrina", uf: "PR" },
  { nome: "Maringá", uf: "PR" },
  { nome: "Ponta Grossa", uf: "PR" },
  { nome: "Cascavel", uf: "PR" },
  { nome: "Foz do Iguaçu", uf: "PR" },
  { nome: "Colombo", uf: "PR" },
  { nome: "Guarapuava", uf: "PR" },
  { nome: "Paranaguá", uf: "PR" },
  { nome: "Apucarana", uf: "PR" },
  // CEARÁ (CE)
  { nome: "Fortaleza", uf: "CE" },
  { nome: "Caucaia", uf: "CE" },
  { nome: "Juazeiro do Norte", uf: "CE" },
  { nome: "Maracanaú", uf: "CE" },
  { nome: "Sobral", uf: "CE" },
  { nome: "Itapipoca", uf: "CE" },
  { nome: "Quixadá", uf: "CE" },
  { nome: "Crato", uf: "CE" },
  // PERNAMBUCO (PE)
  { nome: "Recife", uf: "PE" },
  { nome: "Jaboatão dos Guararapes", uf: "PE" },
  { nome: "Olinda", uf: "PE" },
  { nome: "Caruaru", uf: "PE" },
  { nome: "Paulista", uf: "PE" },
  { nome: "Petrolina", uf: "PE" },
  { nome: "Garanhuns", uf: "PE" },
  { nome: "Abreu e Lima", uf: "PE" },
  // PARÁ (PA)
  { nome: "Belém", uf: "PA" },
  { nome: "Ananindeua", uf: "PA" },
  { nome: "Santarém", uf: "PA" },
  { nome: "Marabá", uf: "PA" },
  { nome: "Parauapebas", uf: "PA" },
  { nome: "Itaituba", uf: "PA" },
  { nome: "Abaetetuba", uf: "PA" },
  // MARANHÃO (MA)
  { nome: "São Luís", uf: "MA" },
  { nome: "Imperatriz", uf: "MA" },
  { nome: "Timon", uf: "MA" },
  { nome: "Caxias", uf: "MA" },
  { nome: "Bacabal", uf: "MA" },
  // DISTRITO FEDERAL (DF)
  { nome: "Brasília", uf: "DF" },
  { nome: "Taguatinga", uf: "DF" },
  { nome: "Gama", uf: "DF" },
  { nome: "Planaltina", uf: "DF" },
  // GOIÁS (GO)
  { nome: "Goiânia", uf: "GO" },
  { nome: "Aparecida de Goiânia", uf: "GO" },
  { nome: "Anápolis", uf: "GO" },
  { nome: "Luziânia", uf: "GO" },
  { nome: "Trindade", uf: "GO" },
  // MATO GROSSO (MT)
  { nome: "Cuiabá", uf: "MT" },
  { nome: "Várzea Grande", uf: "MT" },
  { nome: "Rondonópolis", uf: "MT" },
  { nome: "Sinop", uf: "MT" },
  // MATO GROSSO DO SUL (MS)
  { nome: "Campo Grande", uf: "MS" },
  { nome: "Dourados", uf: "MS" },
  { nome: "Três Lagoas", uf: "MS" },
  { nome: "Corumbá", uf: "MS" },
  // AMAZONAS (AM)
  { nome: "Manaus", uf: "AM" },
  { nome: "Parintins", uf: "AM" },
  { nome: "Itacoatiara", uf: "AM" },
  // RORAIMA (RR)
  { nome: "Boa Vista", uf: "RR" },
  // AMAPÁ (AP)
  { nome: "Macapá", uf: "AP" },
  // TOCANTINS (TO)
  { nome: "Palmas", uf: "TO" },
  { nome: "Araguaína", uf: "TO" },
  // ESPÍRITO SANTO (ES)
  { nome: "Vitória", uf: "ES" },
  { nome: "Vila Velha", uf: "ES" },
  { nome: "Serra", uf: "ES" },
  { nome: "Cariacica", uf: "ES" },
  { nome: "Linhares", uf: "ES" },
  // SANTA CATARINA (SC)
  { nome: "Florianópolis", uf: "SC" },
  { nome: "Joinville", uf: "SC" },
  { nome: "Blumenau", uf: "SC" },
  { nome: "Chapecó", uf: "SC" },
  { nome: "Itajaí", uf: "SC" },
  { nome: "Criciúma", uf: "SC" },
  // ALAGOAS (AL)
  { nome: "Maceió", uf: "AL" },
  { nome: "Arapiraca", uf: "AL" },
  { nome: "Rio Largo", uf: "AL" },
  // SERGIPE (SE)
  { nome: "Aracaju", uf: "SE" },
  { nome: "Nossa Senhora do Socorro", uf: "SE" },
  // PIAUÍ (PI)
  { nome: "Teresina", uf: "PI" },
  { nome: "Parnaíba", uf: "PI" },
  { nome: "Picos", uf: "PI" },
  // RIO GRANDE DO NORTE (RN)
  { nome: "Natal", uf: "RN" },
  { nome: "Mossoró", uf: "RN" },
  { nome: "Parnamirim", uf: "RN" },
  // PARAÍBA (PB)
  { nome: "João Pessoa", uf: "PB" },
  { nome: "Campina Grande", uf: "PB" },
  { nome: "Santa Rita", uf: "PB" },
];

const C = {
  pri: "#0C8C5E", priDk: "#07634A", priLt: "#E6F5EF", priGlow: "#0C8C5E22",
  acc: "#E8A817", accLt: "#FEF7E0", cor: "#E8573A", corLt: "#FEF0ED",
  dk: "#111827", dkSoft: "#1F2937", g: "#6B7280", gL: "#9CA3AF", gB: "#E5E7EB", gBg: "#F3F4F6", w: "#FFFFFF",
};
const font = { d: "'Outfit', sans-serif", b: "'DM Sans', sans-serif" };

const CATS_DEFAULT = ["Eletricista", "Encanador", "Pintor", "Pedreiro", "Cabeleireiro", "Técnico TI", "Mecânico", "Fotógrafo", "Diarista", "Enfermeiro", "Arquiteto", "Chef"];

const PLANS = [
  {
    name: "START",
    price: "0",
    icon: "🚀",
    free: true,
    feats: ["Perfil público", "WhatsApp visível", "1 cidade", "Até 5 fotos", "Avaliações", "Aparecer nas buscas"],
    restrictions: ["Menor prioridade", "Sem selo", "Sem estatísticas", "Sem vídeo"],
    photoLimit: 5,
    videoLimit: 0,
    cityLimit: 1,
  },
  {
    name: "IMPULSO",
    price: "19.90",
    icon: "⭐",
    popular: true,
    feats: ["Tudo START +", "Prioridade nas buscas", "Até 3 cidades", "Até 10 fotos", "1 vídeo", "Estatísticas", "Selo Profissional Verificado"],
    photoLimit: 10,
    videoLimit: 1,
    cityLimit: 3,
    trial: true,
    trialDays: 15,
  },
  {
    name: "DESTAQUE",
    price: "49.90",
    icon: "💎",
    feats: ["Tudo IMPULSO +", "Topo das pesquisas", "Cidades ilimitadas", "Perfil Premium", "Logotipo da empresa", "Até 10 fotos", "Até 3 vídeos", "Selo Ouro", "Relatórios de desempenho", "Badge Mais Contratado", "Prioridade máxima na busca"],
    photoLimit: 10,
    videoLimit: 3,
    cityLimit: 999,
  },
];

function trackEvent(e, d) { try { if (window.fbq) window.fbq("track", e, d); } catch (x) {} }

function getTrialDates() {
  const today = new Date();
  const endDate = new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000);
  return { trial_start_date: today.toISOString(), trial_end_date: endDate.toISOString(), trial_active: true };
}

export default function RegisterProfessional({ onBack, onSuccess, nav }) {
  const [step, setStep] = useState(1);
  const [plan, setPlan] = useState("IMPULSO");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const [f, setF] = useState({ name: "", email: "", pass: "", pass2: "", wa: "", city: "", uf: "", cats: [], novaCat: "", bio: "" });

  const v = () => {
    const e = {};
    if (!f.name.trim()) e.name = "Obrigatório";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Email inválido";
    if (f.pass.length < 8) e.pass = "Min. 8 chars";
    if (f.pass !== f.pass2) e.pass2 = "Não combinam";
    if (f.wa.replace(/\D/g, "").length < 10) e.wa = "Inválido";
    if (!f.city.trim()) e.city = "Obrigatório";
    if (!f.uf) e.uf = "Obrigatório";
    if (f.cats.length === 0) e.cats = "Min. 1";
    if (f.bio.length < 20) e.bio = "Min. 20 chars";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const addCategory = () => {
    if (f.novaCat.trim() && f.cats.length < 5) {
      setF({...f, cats: [...f.cats, f.novaCat.trim()], novaCat: ""});
    }
  };

  const next = () => {
    if (step === 1) { 
      if (v()) { 
        setStep(2); 
        trackEvent("CompleteRegistration"); 
        setTimeout(() => scrollRef.current?.scrollTo(0, 0), 100);
      } 
    }
    else if (step === 2) {
      setStep(3);
      trackEvent("Lead", { plan });
      setTimeout(() => scrollRef.current?.scrollTo(0, 0), 100);
    }
  };

  const submit = async () => {
    setLoading(true);
    try {
      if (!window.SupabaseAPI) {
        throw new Error("Supabase não carregou. Recarregue a página.");
      }

      window.SupabaseAPI.initSupabase();

      const selectedPlan = PLANS.find(p => p.name === plan);

      // 1) Cria a conta com login seguro (a senha é criptografada pelo Supabase)
      const { data: authData, error: authError } = await window.SupabaseAPI.signUpUser(f.email, f.pass, { name: f.name });

      if (authError || !authData?.user) {
        const msg = (authError?.message || "").toLowerCase();
        if (msg.includes("already") || msg.includes("registered") || msg.includes("exists")) {
          throw new Error("Este email já está cadastrado. Tente fazer login.");
        }
        throw new Error(authError?.message || "Erro ao criar conta");
      }

      const userId = authData.user.id;

      // 2) Completa o perfil profissional ligado a essa conta.
      // OBS: a linha já foi criada automaticamente no banco (via trigger) quando
      // a conta de login foi criada acima. Aqui apenas atualizamos (update) os
      // dados extras do cadastro — não inserimos (insert) de novo.
      const userData = {
        name: f.name,
        whatsapp: f.wa,
        city: `${f.city}, ${f.uf}`,
        categories: f.cats,
        bio: f.bio,
        avatar_initials: f.name.substring(0, 2).toUpperCase(),
        trial_active: selectedPlan.trial === true,
        trial_days_left: selectedPlan.trial === true ? 15 : 0,
      };

      const { data: profesional, error: userError } = await window.SupabaseAPI.updateProfile(userId, userData);

      if (userError) {
        throw new Error(userError.message || "Erro ao criar perfil");
      }

      const trialDates = selectedPlan.trial === true ? getTrialDates() : {};
      const subscriptionData = {
        professional_id: userId,
        subscription_plan: plan,
        plan_price: selectedPlan.price,
        status: "active",
        trial_active: selectedPlan.trial === true,
        photo_limit: selectedPlan.photoLimit,
        extra_photo_packages: 0,
        banner_active: false,
        ...trialDates,
      };

      const { data: subscription, error: subError } = await window.SupabaseAPI.createSubscription(subscriptionData);

      if (subError) {
        throw new Error(subError.message || "Erro ao criar assinatura");
      }

      trackEvent("Subscribe", { plan, value: selectedPlan.price, currency: "BRL" });
      
      if (onSuccess) {
        onSuccess({ 
          ...f, 
          plan, 
          id: userId,
          subscriptionId: subscription.id,
          trial_active: selectedPlan.trial === true,
          trial_days_left: selectedPlan.trial === true ? 15 : 0,
        });
      }
    } catch (err) {
      console.error("Erro no cadastro:", err);
      setErrors({ sub: err.message || "Erro ao criar conta. Tente novamente." });
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div ref={scrollRef} style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", overflowY: "auto", background: C.w, paddingBottom: 80 }}>
      <div style={{ padding: "16px" }}>
        {step > 1 && <button onClick={() => { setStep(step - 1); setErrors({}); }} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "15px", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: 700, cursor: "pointer", fontFamily: font.d, width: "100%", background: C.gBg, color: C.dk, marginBottom: "12px" }}>← Voltar</button>}
        
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div><div style={{ fontFamily: font.d, fontWeight: 800, fontSize: 24, color: C.pri }}>TáNaMão</div><div style={{ fontSize: 12, color: C.gL, letterSpacing: "0.1em", textTransform: "uppercase" }}>Cadastro Pro</div></div>
            <div style={{ fontSize: 24 }}>{'●'.repeat(step)}{'○'.repeat(3 - step)}</div>
          </div>
          <div style={{ display: "flex", gap: 6, margin: "12px 0 24px" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: step >= 1 ? C.pri : C.gB, ...(step >= 1 && { width: 20, borderRadius: 4 }) }}></div>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: step >= 2 ? C.pri : C.gB, ...(step >= 2 && { width: 20, borderRadius: 4 }) }}></div>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: step >= 3 ? C.pri : C.gB, ...(step >= 3 && { width: 20, borderRadius: 4 }) }}></div>
          </div>
        </div>

        {step === 1 && (
          <>
            <h1 style={{ fontFamily: font.d, fontSize: 22, fontWeight: 800, color: C.dk }}>Crie seu perfil</h1>
            <p style={{ fontSize: 13, color: C.gL, marginTop: 4 }}>Preencha seus dados para começar</p>

            <div style={{ marginBottom: 16, marginTop: 20 }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: 14, color: C.dk, marginBottom: 8 }}>Nome completo *</label>
              <input type="text" style={{ width: "100%", padding: "13px 14px", border: `2px solid ${errors.name ? C.cor : C.gB}`, borderRadius: 12, fontSize: 14, outline: "none", fontFamily: font.b }} value={f.name} onChange={e => { setF({...f, name: e.target.value}); if(errors.name) setErrors({...errors, name: null}); }} placeholder="João Silva"/>
              {errors.name && <div style={{ color: C.cor, fontSize: 12, marginTop: 4 }}>{errors.name}</div>}
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: 14, color: C.dk, marginBottom: 8 }}>Email *</label>
              <input type="email" style={{ width: "100%", padding: "13px 14px", border: `2px solid ${errors.email ? C.cor : C.gB}`, borderRadius: 12, fontSize: 14, outline: "none", fontFamily: font.b }} value={f.email} onChange={e => { setF({...f, email: e.target.value}); if(errors.email) setErrors({...errors, email: null}); }} placeholder="seu@email.com"/>
              {errors.email && <div style={{ color: C.cor, fontSize: 12, marginTop: 4 }}>{errors.email}</div>}
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: 14, color: C.dk, marginBottom: 8 }}>Senha *</label>
              <input type="password" style={{ width: "100%", padding: "13px 14px", border: `2px solid ${errors.pass ? C.cor : C.gB}`, borderRadius: 12, fontSize: 14, outline: "none", fontFamily: font.b }} value={f.pass} onChange={e => { setF({...f, pass: e.target.value}); if(errors.pass) setErrors({...errors, pass: null}); }} placeholder="Min. 8 caracteres"/>
              {errors.pass && <div style={{ color: C.cor, fontSize: 12, marginTop: 4 }}>{errors.pass}</div>}
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: 14, color: C.dk, marginBottom: 8 }}>Confirmar senha *</label>
              <input type="password" style={{ width: "100%", padding: "13px 14px", border: `2px solid ${errors.pass2 ? C.cor : C.gB}`, borderRadius: 12, fontSize: 14, outline: "none", fontFamily: font.b }} value={f.pass2} onChange={e => { setF({...f, pass2: e.target.value}); if(errors.pass2) setErrors({...errors, pass2: null}); }} placeholder="Repita a senha"/>
              {errors.pass2 && <div style={{ color: C.cor, fontSize: 12, marginTop: 4 }}>{errors.pass2}</div>}
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: 14, color: C.dk, marginBottom: 8 }}>WhatsApp (com DDD) *</label>
              <input type="tel" style={{ width: "100%", padding: "13px 14px", border: `2px solid ${errors.wa ? C.cor : C.gB}`, borderRadius: 12, fontSize: 14, outline: "none", fontFamily: font.b }} value={f.wa} onChange={e => { setF({...f, wa: e.target.value}); if(errors.wa) setErrors({...errors, wa: null}); }} placeholder="(11) 99999-0000"/>
              {errors.wa && <div style={{ color: C.cor, fontSize: 12, marginTop: 4 }}>{errors.wa}</div>}
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: 14, color: C.dk, marginBottom: 8 }}>Cidade *</label>
              <select style={{ width: "100%", padding: "13px 14px", border: `2px solid ${errors.city ? C.cor : C.gB}`, borderRadius: 12, fontSize: 14, outline: "none", fontFamily: font.b }} value={f.city} onChange={e => { setF({...f, city: e.target.value}); if(errors.city) setErrors({...errors, city: null}); }}>
                <option value="">Selecione uma cidade</option>
                {CIDADES_BRASIL.map((c, i) => <option key={i} value={c.nome}>{c.nome} - {c.uf}</option>)}
              </select>
              {errors.city && <div style={{ color: C.cor, fontSize: 12, marginTop: 4 }}>{errors.city}</div>}
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: 14, color: C.dk, marginBottom: 8 }}>Estado (UF) *</label>
              <input type="text" style={{ width: "100%", padding: "13px 14px", border: `2px solid ${errors.uf ? C.cor : C.gB}`, borderRadius: 12, fontSize: 14, outline: "none", fontFamily: font.b, textTransform: "uppercase" }} value={f.uf} onChange={e => { setF({...f, uf: e.target.value.toUpperCase().slice(0, 2)}); if(errors.uf) setErrors({...errors, uf: null}); }} placeholder="SP" maxLength="2"/>
              {errors.uf && <div style={{ color: C.cor, fontSize: 12, marginTop: 4 }}>{errors.uf}</div>}
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: 14, color: C.dk, marginBottom: 8 }}>Categorias ({f.cats.length}/5) *</label>
              {errors.cats && <div style={{ color: C.cor, fontSize: 12, marginBottom: 8 }}>{errors.cats}</div>}
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginBottom: 12 }}>
                {CATS_DEFAULT.map(cat => <button key={cat} type="button" onClick={() => { setF({...f, cats: f.cats.includes(cat) ? f.cats.filter(c => c !== cat) : f.cats.length < 5 ? [...f.cats, cat] : f.cats}); if(errors.cats) setErrors({...errors, cats: null}); }} style={{ padding: 12, border: `2px solid ${f.cats.includes(cat) ? C.pri : C.gB}`, borderRadius: 10, background: f.cats.includes(cat) ? C.priLt : "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: font.b, color: f.cats.includes(cat) ? C.pri : C.dk }}>{cat}</button>)}
              </div>

              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <input type="text" style={{ flex: 1, padding: "10px 12px", border: `2px solid ${C.gB}`, borderRadius: 10, fontSize: 12, outline: "none", fontFamily: font.b }} value={f.novaCat} onChange={e => setF({...f, novaCat: e.target.value})} placeholder="Adicione outra" onKeyPress={e => e.key === "Enter" && addCategory()} />
                <button type="button" onClick={addCategory} style={{ padding: "10px 16px", background: C.pri, color: "#fff", border: "none", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: font.b }}>+</button>
              </div>

              {f.cats.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {f.cats.map((cat, i) => (
                    <div key={i} style={{ background: C.priLt, color: C.pri, padding: "6px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                      {cat}
                      <button type="button" onClick={() => setF({...f, cats: f.cats.filter((_, idx) => idx !== i)})} style={{ background: "none", border: "none", color: C.pri, cursor: "pointer", fontSize: 16, padding: 0 }}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: 14, color: C.dk, marginBottom: 8 }}>Bio ({f.bio.length}/100) *</label>
              <textarea style={{ width: "100%", padding: "13px 14px", border: `2px solid ${errors.bio ? C.cor : C.gB}`, borderRadius: 12, fontSize: 14, outline: "none", fontFamily: font.b, resize: "vertical" }} value={f.bio} onChange={e => { setF({...f, bio: e.target.value}); if(errors.bio) setErrors({...errors, bio: null}); }} placeholder="Fale sobre sua experiência..." rows="4" maxLength="100"/>
              {errors.bio && <div style={{ color: C.cor, fontSize: 12, marginTop: 4 }}>{errors.bio}</div>}
            </div>

            <button type="button" onClick={next} style={{ padding: "15px", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: 700, cursor: "pointer", fontFamily: font.d, width: "100%", background: `linear-gradient(135deg, ${C.pri}, ${C.acc})`, color: "#fff", marginBottom: 20 }}>Continuar → Escolher Plano</button>
          </>
        )}

        {step === 2 && (
          <>
            <h1 style={{ fontFamily: font.d, fontSize: 22, fontWeight: 800, color: C.dk }}>Escolha seu plano</h1>
            <p style={{ fontSize: 13, color: C.gL, marginTop: 4 }}>15 dias grátis no plano IMPULSO (sem cartão)</p>

            <div style={{ margin: "24px 0 16px" }}>
              {PLANS.map(p => (
                <div key={p.name} onClick={() => setPlan(p.name)} style={{ background: plan === p.name ? C.priLt : "#fff", borderRadius: 14, border: `2px solid ${plan === p.name ? C.pri : C.gB}`, borderWidth: plan === p.name ? 2.5 : 2, padding: 18, marginBottom: 12, cursor: "pointer", transition: "all 0.2s" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 20 }}>{p.icon}</span>
                        <div style={{ fontFamily: font.d, fontSize: 16, fontWeight: 800 }}>{p.name}</div>
                      </div>
                      <div style={{ fontSize: 14, color: C.gL, marginTop: 2 }}>R$ {p.price}<span style={{ fontSize: 11, color: C.gL }}>/mês</span></div>
                      {p.trial && <div style={{ display: "inline-block", background: C.accLt, color: C.acc, fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 5, marginTop: 8 }}>⏱️ 15 dias grátis</div>}
                      {p.popular && <div style={{ display: "inline-block", background: C.accLt, color: C.acc, fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 5, marginLeft: 8, marginTop: 8 }}>⭐ Mais Popular</div>}
                    </div>
                    <div style={{ fontSize: 24 }}>{plan === p.name ? '✓' : ''}</div>
                  </div>
                  <div style={{ fontSize: 12, color: C.dk, marginBottom: 8, fontWeight: 600 }}>Recursos:</div>
                  {p.feats.map((feat, i) => <div key={i} style={{ fontSize: 12, color: C.dk, padding: "6px 0", display: "flex", alignItems: "center", gap: 6 }}><span style={{ color: C.pri }}>✓</span> {feat}</div>)}
                  {p.restrictions && (
                    <>
                      <div style={{ fontSize: 12, color: C.gL, marginTop: 8, marginBottom: 4, fontWeight: 600 }}>Restrições:</div>
                      {p.restrictions.map((res, i) => <div key={i} style={{ fontSize: 12, color: C.gL, padding: "4px 0", display: "flex", alignItems: "center", gap: 6 }}><span>–</span> {res}</div>)}
                    </>
                  )}
                </div>
              ))}
            </div>

            <div style={{ padding: 14, background: C.priLt, borderRadius: 10, fontSize: 12, color: C.pri, marginBottom: 16, fontWeight: 600 }}>
              💡 Todos têm acesso a todas as funções. A diferença é a visibilidade nas buscas!
            </div>

            <button type="button" onClick={next} style={{ padding: "15px", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: 700, cursor: "pointer", fontFamily: font.d, width: "100%", background: `linear-gradient(135deg, ${C.pri}, ${C.acc})`, color: "#fff", marginBottom: 20 }}>Continuar → Confirmar Cadastro</button>
          </>
        )}

        {step === 3 && (
          <>
            <h1 style={{ fontFamily: font.d, fontSize: 22, fontWeight: 800, color: C.dk }}>Confirme seu cadastro</h1>
            <p style={{ fontSize: 13, color: C.gL, marginTop: 4 }}>Revise os dados antes de finalizar</p>

            <div style={{ background: C.priLt, borderRadius: 14, padding: 16, marginBottom: 16, marginTop: 20 }}>
              <div style={{ fontWeight: 700, color: C.pri, marginBottom: 12, fontSize: 14 }}>Seus Dados</div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 13, borderBottom: `1px solid ${C.gB}` }}><span>Nome</span><span style={{ fontWeight: 600, color: C.dk }}>{f.name}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 13, borderBottom: `1px solid ${C.gB}` }}><span>Email</span><span style={{ fontWeight: 600, color: C.dk }}>{f.email}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 13, borderBottom: `1px solid ${C.gB}` }}><span>WhatsApp</span><span style={{ fontWeight: 600, color: C.dk }}>{f.wa}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 13, borderBottom: `1px solid ${C.gB}` }}><span>Localização</span><span style={{ fontWeight: 600, color: C.dk }}>{f.city}, {f.uf}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 13 }}><span>Categorias</span><span style={{ fontWeight: 600, color: C.dk }}>{f.cats.slice(0, 2).join(", ")}{f.cats.length > 2 ? `+${f.cats.length - 2}` : ""}</span></div>
            </div>

            <div style={{ background: C.priLt, borderRadius: 14, padding: 16, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, color: C.pri, marginBottom: 12, fontSize: 14 }}>Seu Plano: {plan}</div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
                <span>Valor</span>
                <span style={{ color: C.pri }}>R$ {PLANS.find(p => p.name === plan).price}/mês</span>
              </div>
              <div style={{ fontSize: 12, color: C.gL }}>
                {plan === "START" && "Sem cobranças"}
                {plan === "IMPULSO" && "15 dias grátis - Depois cobra automaticamente"}
                {plan === "DESTAQUE" && "Contratação agora"}
              </div>
            </div>

            {plan === "IMPULSO" && (
              <div style={{ padding: 12, background: C.accLt, borderRadius: 10, marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: C.acc, fontWeight: 600 }}>
                  ⏱️ Você está experimentando gratuitamente os recursos premium do TáNaMão.
                </div>
                <div style={{ fontSize: 11, color: C.acc, marginTop: 4 }}>
                  Após 15 dias, retornará automaticamente para o plano START (grátis).
                </div>
              </div>
            )}

            <button type="button" onClick={submit} disabled={loading} style={{ padding: "15px", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: 700, cursor: loading ? "wait" : "pointer", fontFamily: font.d, width: "100%", background: `linear-gradient(135deg, ${C.pri}, ${C.acc})`, color: "#fff", opacity: loading ? 0.6 : 1, marginBottom: 20 }}>
              {loading ? "Finalizando..." : "🎉 Finalizar Cadastro"}
            </button>
            {errors.sub && <div style={{ color: C.cor, fontSize: 13, marginTop: 12, textAlign: "center" }}>{errors.sub}</div>}
          </>
        )}
      </div>
    </div>
  );
}
