import 'dotenv/config'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import { connectDatabase } from './config/database.js'
import { User } from './models/user.model.js'
import { Post } from './models/post.model.js'

const seed = async (): Promise<void> => {
  await connectDatabase()

  // Limpa os posts existentes para evitar duplicação de slug
  await Post.deleteMany({})

  // Garante um autor para os posts
  let author = await User.findOne({ email: 'felipe@cidadeviva.com' })
  if (!author) {
    const hashedPassword = await bcrypt.hash('minhasenha123', 10)
    author = await User.create({
      name: 'Felipe Augusto',
      email: 'felipe@cidadeviva.com',
      password: hashedPassword,
    })
  }

  const posts = [
    {
      title: 'Pedalando pela Serra do Japi: roteiro para iniciantes',
      slug: 'pedalando-serra-do-japi-iniciantes',
      excerpt: 'Um roteiro leve pela Serra do Japi para quem está começando no mountain bike.',
      content:
        'A Serra do Japi é um dos patrimônios naturais mais importantes do interior paulista. Para quem está começando, há trilhas de baixa dificuldade com vistas incríveis e pontos de descanso bem sinalizados. Leve água, capacete e saia cedo para aproveitar o clima ameno da manhã.',
      category: 'ciclismo',
      coverImage: 'https://picsum.photos/seed/pedalando-serra-do-japi-iniciantes/1200/630',
      published: true,
      author: author._id,
    },
    {
      title: 'As melhores ciclovias de Jundiaí para o dia a dia',
      slug: 'melhores-ciclovias-jundiai',
      excerpt:
        'Um guia das ciclovias mais seguras e conectadas para usar a bike no trajeto urbano.',
      content:
        'Jundiaí vem ampliando sua malha cicloviária ano após ano. Neste guia reunimos os trechos mais seguros para quem usa a bicicleta como transporte diário, com dicas de conexões entre bairros e pontos de atenção no trânsito.',
      category: 'ciclismo',
      coverImage: 'https://picsum.photos/seed/melhores-ciclovias-jundiai/1200/630',
      published: true,
      author: author._id,
    },
    {
      title: 'Rota do Vinho de Jundiaí: o que provar em cada parada',
      slug: 'rota-do-vinho-jundiai',
      excerpt: 'Um passeio pelas vinícolas e cantinas da tradicional Rota do Vinho.',
      content:
        'A Rota do Vinho é uma das experiências gastronômicas mais queridas da região. Entre cantinas familiares e vinícolas centenárias, dá para provar desde o clássico vinho de mesa até rótulos premiados. Reserve um dia inteiro e vá sem pressa.',
      category: 'gastronomia',
      coverImage: 'https://picsum.photos/seed/rota-do-vinho-jundiai/1200/630',
      published: true,
      author: author._id,
    },
    {
      title: 'Cafés especiais no centro de Jundiaí',
      slug: 'cafes-especiais-centro-jundiai',
      excerpt: 'Onde tomar um bom café especial sem sair do centro da cidade.',
      content:
        'A cena de cafés especiais cresceu bastante nos últimos anos. No centro de Jundiaí você encontra cafeterias que torram os próprios grãos e oferecem métodos como coado e prensa francesa. Selecionamos os endereços que mais valem a visita.',
      category: 'gastronomia',
      coverImage: 'https://picsum.photos/seed/cafes-especiais-centro-jundiai/1200/630',
      published: true,
      author: author._id,
    },
    {
      title: 'Complexo Argos e a cena cultural de Jundiaí',
      slug: 'complexo-argos-cena-cultural',
      excerpt: 'Como o antigo complexo fabril virou um polo cultural da cidade.',
      content:
        'O Complexo Argos é um exemplo de como espaços industriais podem ganhar nova vida. Hoje abriga exposições, eventos e atividades culturais que movimentam a cidade. Conheça a história do espaço e a programação que costuma rolar por lá.',
      category: 'cultura',
      coverImage: 'https://picsum.photos/seed/complexo-argos-cena-cultural/1200/630',
      published: true,
      author: author._id,
    },
    {
      title: 'A história da estação ferroviária de Jundiaí',
      slug: 'historia-estacao-ferroviaria-jundiai',
      excerpt: 'A ferrovia que ajudou a construir a Jundiaí que conhecemos hoje.',
      content:
        'A estação ferroviária teve papel central no desenvolvimento da cidade, ligando o interior ao porto de Santos no auge do café. Neste post recuperamos um pouco dessa história e mostramos o que restou desse patrimônio.',
      category: 'cultura',
      coverImage: 'https://picsum.photos/seed/historia-estacao-ferroviaria-jundiai/1200/630',
      published: true,
      author: author._id,
    },
    {
      title: 'Festa da Uva: o que esperar da edição deste ano',
      slug: 'festa-da-uva-edicao-deste-ano',
      excerpt: 'Atrações, gastronomia e tradição na festa mais famosa da cidade.',
      content:
        'A Festa da Uva é uma das celebrações mais tradicionais de Jundiaí e reúne produtores, food trucks e shows. Reunimos o que se sabe sobre a programação deste ano e dicas para aproveitar o evento evitando as filas mais longas.',
      category: 'eventos',
      coverImage: 'https://picsum.photos/seed/festa-da-uva-edicao-deste-ano/1200/630',
      published: true,
      author: author._id,
    },
    {
      title: 'Feira de orgânicos da Praça Nove de Julho: guia completo',
      slug: 'feira-organicos-praca-nove-de-julho',
      excerpt: 'Tudo sobre a feira de orgânicos mais tradicional do centro.',
      content:
        'Todo sábado a Praça Nove de Julho recebe produtores locais com hortaliças, frutas e produtos artesanais. Neste guia explicamos os horários, o que costuma ter de melhor em cada época do ano e como chegar de bicicleta.',
      category: 'eventos',
      coverImage: 'https://picsum.photos/seed/feira-organicos-praca-nove-de-julho/1200/630',
      published: true,
      author: author._id,
    },
  ]

  await Post.insertMany(posts)
  console.log('Seed concluído: 8 posts criados')

  await mongoose.disconnect()
  process.exit(0)
}

void seed()
