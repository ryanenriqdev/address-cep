'use client'

import Input from "@/components/Input";
import { useState, ChangeEvent } from "react";
import Cep from "@/components/interfaces/Cep";


export default function Home() {
  const [endereco, setEndereco] = useState<Cep>({
    cep: "",
    rua: "",
    bairro: "",
    cidade: "",
    estado: "",
    numero: "",
  });

  const [erro, setErro] = useState<string|null>(null)

  async function requisicao_cep(cep: string) {

    const padrao_cep = /^\d{8}$/
    cep = cep.replace(/[-,.]/, '');
    
    if(!padrao_cep.test(cep)) {
      throw new Error('Formato de CEP inválido. Insira 8 dígitos');
    }

    const url = `https://viacep.com.br/ws/${cep}/json/`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Erro na requisição deste CEP')
    }

    const dados = await response.json();

    if(dados.erro == 'true' || dados.erro == true) {
      throw new Error('Este CEP não foi encontrado na base de dados.')
    }

    return dados
  }

  function mudanca_no_cep(e: ChangeEvent<HTMLInputElement>) {
    const valor_digitado = e.target.value;

    setEndereco({...endereco, cep: valor_digitado});
    
    const cep_limpo = valor_digitado.replace(/[.,-]/, '');

    if (cep_limpo.length === 8) {
      preencher_com_cep(cep_limpo);
    };
  };
  
  async function preencher_com_cep(cepValido: string) {
    try {
      setErro(null)
      const dados = await requisicao_cep(cepValido);

      setEndereco(endereco => ({
        ...endereco,
        cep: dados.cep,
        rua: dados.logradouro || '',
        bairro: dados.bairro || '',
        cidade: dados.localidade || '',
        estado: dados.estado || '',
      }));
    }
    catch(error: unknown) {
      if (error instanceof Error) {
        setErro(error.message)
      }
      else {
        console.error('erro inesperado', error);
      }
    }
  }

  return (
    <>
      <div className="flex flex-col space-y-5 p-15 items-center text-center font-medium text-sm">
        <h1 className="text-3xl pb-4">Endereço</h1>
          {erro && endereco.cep.length === 8 && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative w-lg">
              <span className="block sm:inline">{erro}</span>
            </div>
          )}
          <Input placeholder="CEP" id="cep" value={endereco.cep} onChange={(mudanca_no_cep)} />
          <Input placeholder="RUA" id="rua" value={endereco.rua} onChange={(e: ChangeEvent<HTMLInputElement>) => setEndereco({...endereco, rua:e.target.value})}/>
          <Input placeholder="NÚMERO" id="numero" value={endereco.numero} onChange={(e: ChangeEvent<HTMLInputElement>) => setEndereco({...endereco, numero:e.target.value})}/>
          <Input placeholder="BAIRRO" id="bairro" value={endereco.bairro} onChange={(e: ChangeEvent<HTMLInputElement>) => setEndereco({...endereco, bairro:e.target.value})}/>
          <Input placeholder="ESTADO" id="estado" value={endereco.estado} onChange={(e: ChangeEvent<HTMLInputElement>) => setEndereco({...endereco, estado:e.target.value})}/>
          <Input placeholder="CIDADE" id="cidade" value={endereco.cidade} onChange={(e: ChangeEvent<HTMLInputElement>) => setEndereco({...endereco, cidade:e.target.value})}/>
      </div>
    </>
  );
}
