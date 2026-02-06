import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';

export default function JusIA() {
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', text: 'Olá! Sou seu Assistente Jurídico Virtual (Versão Offline).\n\nComo esta versão roda inteiramente no seu navegador sem conexão com servidor, minhas capacidades de IA são limitadas a ferramentas práticas e modelos.\n\nPosso ajudar com:\n1. Formatação de textos jurídicos\n2. Modelos de petições (Ex: "Modelo Procuração")\n3. Análise básica de texto\n\nComo posso ajudar hoje?' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate AI Response (Simple Rule-Based)
    setTimeout(() => {
      let responseText = "Desculpe, como sou uma versão offline simples, não consigo processar solicitações complexas de linguagem natural sem um servidor de IA. Tente pedir um 'Modelo' ou usar as ferramentas laterais.";
      
      const lowerInput = userMsg.text.toLowerCase();

      // Simple keyword matching for demo purposes
      if (lowerInput.includes('modelo') || lowerInput.includes('petição')) {
          if (lowerInput.includes('procuração')) {
              responseText = "**MODELO DE PROCURAÇÃO AD JUDICIA**\n\nOUTORGANTE: [Nome do Cliente], nacionalidade, estado civil, profissão, portador do CPF nº [000.000.000-00]...\n\nOUTORGADO: [Nome do Advogado], OAB/UF nº [00000]...\n\nPODERES: A quem confere amplos poderes para o foro em geral, com a cláusula ad judicia et extra...";
          } else if (lowerInput.includes('habeas corpus')) {
              responseText = "**MODELO BÁSICO DE HABEAS CORPUS**\n\nEXCELENTÍSSIMO SENHOR DOUTOR DESEMBARGADOR PRESIDENTE DO TRIBUNAL DE JUSTIÇA DO ESTADO DE [ESTADO]\n\n[IMPETRANTE], advogado, inscrito na OAB sob o nº...\n\nVem respeitosamente, à presença de Vossa Excelência, impetrar a presente ordem de\n\nHABEAS CORPUS COM PEDIDO LIMINAR...";
          } else {
              responseText = "Tenho alguns modelos disponíveis nesta versão offline:\n- Procuração\n- Habeas Corpus\n- Declaração de Hipossuficiência\n\nTente digitar 'Modelo Procuração', por exemplo.";
          }
      } else if (lowerInput.includes('obrigado') || lowerInput.includes('oi') || lowerInput.includes('olá')) {
          responseText = "De nada! Estou à disposição para ajudar com ferramentas práticas.";
      } else if (lowerInput.includes('analisar') || lowerInput.includes('análise')) {
           responseText = "Para análise de texto, por favor, use a ferramenta 'Análise de Peça' na barra lateral.";
      }

      setMessages(prev => [...prev, { id: Date.now()+1, role: 'assistant', text: responseText }]);
    }, 600);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#f5f5f7] dark:bg-[#121212] overflow-hidden">
      <Head>
        <title>JUS IA - Assistente Jurídico</title>
      </Head>

      {/* Sidebar Tools */}
      <div className="w-80 bg-white dark:bg-[#1e1e1e] border-r border-gray-200 dark:border-gray-800 flex-col hidden md:flex">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
           <h2 className="font-bold text-lg dark:text-gray-100 flex items-center gap-2">
             <i className="fas fa-balance-scale text-blue-600"></i> Ferramentas
           </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <ToolCard icon="file-alt" title="Análise de Texto" desc="Contagem e palavras-chave" onClick={() => {
                setMessages(prev => [...prev, { id: Date.now(), role: 'assistant', text: "Ferramenta de Análise: Cole seu texto aqui para que eu conte palavras e verifique termos repetidos (Funcionalidade demonstrativa)." }]);
            }} />
             <ToolCard icon="calendar-alt" title="Calculadora de Prazos" desc="Dias úteis (Simples)" onClick={() => {
                setMessages(prev => [...prev, { id: Date.now(), role: 'assistant', text: "Para calcular prazos: Diga 'Somar 15 dias úteis a partir de hoje' (Lógica simplificada nesta versão)." }]);
            }} />
             <ToolCard icon="gavel" title="Jurisprudência" desc="Buscador (Simulado)" onClick={() => {
                setMessages(prev => [...prev, { id: Date.now(), role: 'assistant', text: "A busca de jurisprudência requer conexão com a internet/API. Nesta versão offline, consulte o site do tribunal diretamente." }]);
            }} />
        </div>
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 m-4 rounded-lg">
            <p className="text-xs text-blue-800 dark:text-blue-300">
                <i className="fas fa-lock mr-1"></i> Modo Seguro: Nenhum dado digitado aqui é enviado para servidores externos. Tudo roda no seu navegador.
            </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="h-14 border-b border-gray-200 dark:border-gray-800 flex items-center px-6 bg-white dark:bg-[#1e1e1e] justify-between">
              <div>
                  <h1 className="font-bold text-gray-800 dark:text-white">JUS IA</h1>
                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online (Local)
                  </p>
              </div>
              <button className="md:hidden text-gray-500" onClick={() => alert("Menu lateral apenas em Desktop por enquanto.")}><i className="fas fa-bars"></i></button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm whitespace-pre-wrap ${
                          msg.role === 'user' 
                          ? 'bg-blue-600 text-white rounded-br-none' 
                          : 'bg-white dark:bg-[#252525] text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-bl-none'
                      }`}>
                          {msg.role === 'assistant' && (
                              <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wide">
                                  <i className="fas fa-robot"></i> Jus IA
                              </div>
                          )}
                          <div className="text-sm leading-relaxed">{msg.text}</div>
                      </div>
                  </div>
              ))}
              <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white dark:bg-[#1e1e1e] border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-end gap-2 max-w-4xl mx-auto border border-gray-300 dark:border-gray-600 rounded-xl p-2 bg-gray-50 dark:bg-[#252525] focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                  <textarea 
                      className="flex-1 bg-transparent border-none outline-none text-gray-800 dark:text-gray-100 resize-none max-h-32 min-h-[44px] py-2.5 px-2"
                      placeholder="Digite sua dúvida jurídica ou peça um modelo..."
                      rows={1}
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSend();
                          }
                      }}
                  />
                  <button 
                      onClick={handleSend}
                      disabled={!input.trim()}
                      className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-0.5"
                  >
                      <i className="fas fa-paper-plane"></i>
                  </button>
              </div>
              <p className="text-center text-[10px] text-gray-400 mt-2">
                  A JUS IA pode cometer erros. Verifique sempre as informações legais. Versão Offline v1.0.
              </p>
          </div>
      </div>
    </div>
  );
}

const ToolCard = ({ icon, title, desc, onClick }) => (
    <div onClick={onClick} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#252525] cursor-pointer transition-colors group">
        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <i className={`fas fa-${icon}`}></i>
        </div>
        <div>
            <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-200">{title}</h3>
            <p className="text-xs text-gray-500">{desc}</p>
        </div>
    </div>
);
