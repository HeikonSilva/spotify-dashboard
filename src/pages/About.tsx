import { NavLink } from 'react-router'

export default function About() {
  return (
    <div className="flex gap-4 flex-col">
      <div>
        <h1 className="text-4xl font-bold">Spotify? Por que?</h1>
        <p className="mt-2">
          Inicialmente a intenção era recolher socioindicadores das cidades,
          como as áreas com mais transito e coisas do tipo, mas como esse tema
          tem dados escassos procuramos outra coisa.
        </p>
        <p>
          MUSICA! Todo mundo ouve musica (ou quase todo mundo), então porque não
          fazer do tema o spotify, o principal aplicativo de streaming de musica
          do Brasil.
        </p>
      </div>
      <div>
        <h1 className="text-4xl font-bold">Mas o que mostra esse projeto??</h1>
        <p className="mt-2">A gente separou em dois:</p>
        <ul className="list-disc ml-6 mt-2">
          <li>
            O projeto em Microsoft Power BI, onde a gente mostra algumas
            estatisticas globais que foram recolhidos pelo o Spotify
          </li>
          <li>
            O web, onde a gente fez um dashboard interativo utilizando a api do
            Spotify mostrando algumas informações do usuário.
          </li>
        </ul>
      </div>
      <div>
        <h1 className="text-2xl font-bold">Estilização?</h1>
        <p className="mt-2">
          Um dos nossos objetivos foi fazer uma interface semelhante ao do
          spotify, em tanto os projetos.
        </p>
      </div>
      <div>
        <h1 className="text-2xl font-bold">Considerações Finais</h1>
        <p className="mt-2">
          Agora que você já sabe um pouquinho sobre a história de criação do
          nosso projeto,veja você mesmo com seus próprios olhos!
        </p>
        <NavLink to={'/login'}>
          <button className="transition-all mt-4 rounded-xl bg-sprimary text-zinc-100 hover:text-white hover:bg-sprimary/70 p-2">
            Entre Agora
          </button>
        </NavLink>
      </div>
    </div>
  )
}
