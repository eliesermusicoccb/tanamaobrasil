/**
 * LISTA COMPLETA DE CIDADES BRASILEIRAS
 * Maiores cidades por estado + capitais
 * Total: 100+ cidades
 */

export const CIDADES_BRASIL = [
  // SÃO PAULO (SP)
  { nome: "São Paulo", uf: "SP" },
  { nome: "Guarulhos", uf: "SP" },
  { nome: "Campinas", uf: "SP" },
  { nome: "Santos", uf: "SP" },
  { nome: "Sorocaba", uf: "SP" },
  { nome: "Ribeirão Preto", uf: "SP" },
  { nome: "Piracicaba", uf: "SP" },
  { nome: "Diadema", uf: "SP" },
  { nome: "Mauá", uf: "SP" },
  { nome: "Santo André", uf: "SP" },
  { nome: "São Bernardo do Campo", uf: "SP" },
  { nome: "Osasco", uf: "SP" },
  { nome: "Bauru", uf: "SP" },
  { nome: "Araraquara", uf: "SP" },
  { nome: "Jundiaí", uf: "SP" },

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

// Função auxiliar para buscar cidades por UF
export function getCidadesByUF(uf) {
  return CIDADES_BRASIL.filter(cidade => cidade.uf === uf);
}

// Função para ordenar alfabeticamente
export const CIDADES_ORDENADAS = CIDADES_BRASIL.sort((a, b) => 
  a.nome.localeCompare(b.nome, 'pt-BR')
);

export default CIDADES_BRASIL;
