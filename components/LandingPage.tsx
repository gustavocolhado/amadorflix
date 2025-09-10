'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { FaFire, FaPlay, FaEye, FaHeart, FaClock, FaUsers, FaVideo, FaSearch, FaCrown, FaTags, FaThLarge, FaComments, FaUpload, FaPlus, FaUserCircle, FaCheck, FaArrowRight, FaCopy, FaSpinner, FaTimes, FaUnlock, FaShieldAlt, FaMobile, FaCalendarAlt, FaHeadphones, FaChevronLeft, FaChevronRight, FaLock } from 'react-icons/fa';
import Image from 'next/image';
import Container from '@/components/Container';
import PixPaymentWithAutoCheck from './PixPaymentWithAutoCheck';


interface Plan {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  description: string;
  popular?: boolean;
}

interface PixResponse {
  id: string;
  qr_code: string;
  status: string;
  value: number;
  qr_code_base64: string;
}

export default function LandingPage() {
  const { data: session } = useSession();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showPixPayment, setShowPixPayment] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pixData, setPixData] = useState<PixResponse | null>(null);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutos em segundos
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [referralData, setReferralData] = useState<{
    source: string;
    campaign: string;
    referrer: string;
  } | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Função para alternar o som do vídeo
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  // Capturar dados de referência quando a página carregar
  useEffect(() => {
    const captureReferralData = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const referrer = document.referrer;
      
      // Capturar parâmetros de referência específicos para assinaturas
      // Prioridade: source > ref > utm_source > referrer domain
      const source = urlParams.get('source') || urlParams.get('ref') || urlParams.get('utm_source');
      const campaign = urlParams.get('campaign') || urlParams.get('utm_campaign') || urlParams.get('xclickads');
      const referrerDomain = referrer ? new URL(referrer).hostname : null;
      
      // Se não há parâmetros na URL, usar o referrer
      const finalSource = source || referrerDomain || 'direct';
      const finalCampaign = campaign || 'organic';
      const finalReferrer = referrer || 'direct';
      
      // Capturar URL completa para análise posterior
      const currentUrl = window.location.href;
      
      setReferralData({
        source: finalSource,
        campaign: finalCampaign,
        referrer: finalReferrer
      });
      
      // Salvar no localStorage para persistir durante a sessão
      const referralInfo = {
        source: finalSource,
        campaign: finalCampaign,
        referrer: finalReferrer,
        currentUrl: currentUrl,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('referralData', JSON.stringify(referralInfo));
      
      console.log('📊 Referral data captured for subscription tracking:', {
        source: finalSource,
        campaign: finalCampaign,
        referrer: finalReferrer,
        currentUrl: currentUrl,
        urlParams: Object.fromEntries(urlParams.entries())
      });
      
      // Log específico para URLs de assinatura
      if (source || campaign) {
        console.log('🎯 Subscription tracking URL detected:', {
          url: currentUrl,
          source: source,
          campaign: campaign,
          fullParams: Object.fromEntries(urlParams.entries())
        });
      }
    };
    
    captureReferralData();
  }, []);

  // Se o usuário estiver logado, não renderizar a landing page
  if (session) {
    return null;
  }

  const faqData = [
    {
      question: "Minha privacidade e segurança estão garantidas ?",
      answer: "Sim, utilizamos criptografia de ponta a ponta e não compartilhamos seus dados com terceiros. Todas as transações são 100% seguras e discretas."
    },
    {
      question: "O conteúdo vale a pena?",
      answer: "Absolutamente! Temos mais de 50.000 conteúdos exclusivos, atualizados diariamente, com qualidade premium que você não encontra em nenhum outro lugar."
    },
    {
      question: "Tenho que assinar por um longo prazo ?",
      answer: "Não! Oferecemos planos flexíveis a partir de 7 dias. Você pode testar nossa plataforma e depois escolher o plano que melhor se adapta às suas necessidades."
    },
    {
      question: "Posso cancelar a qualquer momento ?",
      answer: "Você paga somente uma vez, e pode renovar só se quiser."
    }
  ];

  const plans: Plan[] = [
    {
      id: 'annual',
      title: '1 ANO DE ACESSO',
      price: 100, // R$ 39,90 em centavos
      description: 'Pague via pix',
      popular: false
    },
    {
      id: 'quarterly',
      title: '3 MESES PIX',
      price: 3990, // R$ 39,90 em centavos
      description: 'Pague via pix',
      popular: false
    },
    {
      id: 'monthly',
      title: '1 MÊS',
      price: 1990, // R$ 29,90 em centavos
      description: 'Pague com Cartão de Credito',
      popular: false
    },
    {
      id: 'weekly',
      title: '7 DIAS DE ACESSO',
      price: 1490, // R$ 19,90 em centavos
      description: 'Pague via pix',
      popular: false
    }
  ];

  // Timer para o PIX
  useEffect(() => {
    if (showPixPayment && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showPixPayment, timeLeft]);

  // Função para verificar status do pagamento manualmente
  const checkPaymentStatus = async () => {
    if (!pixData) return;
    
    setIsCheckingPayment(true);
    try {
      const response = await fetch('/api/premium/check-payment-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pixId: pixData.id
        }),
      });

      if (response.ok) {
        const statusData = await response.json();
        if (statusData.paid && !paymentConfirmed) {
          // Pagamento confirmado! Mostrar formulário de senha
          setPaymentConfirmed(true);
          setShowPixPayment(false);
          setShowPasswordForm(true);
        } else {
          alert('Pagamento ainda não foi confirmado. Tente novamente em alguns instantes.');
        }
      } else {
        alert('Erro ao verificar pagamento. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      alert('Erro ao verificar pagamento. Tente novamente.');
    } finally {
      setIsCheckingPayment(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowModal(true);
    setShowPixPayment(false);
    setEmail('');
    setPixData(null);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !selectedPlan) return;

    setIsLoading(true);
    try {
      // Obter dados de referência do localStorage ou estado atual
      const storedReferralData = localStorage.getItem('referralData');
      const referralInfo = storedReferralData ? JSON.parse(storedReferralData) : referralData;
      
      // Adicionar informações extras de rastreamento
      const enhancedReferralData = {
        ...referralInfo,
        planSelected: selectedPlan.id,
        planPrice: selectedPlan.price,
        userAgent: navigator.userAgent,
        screenResolution: `${screen.width}x${screen.height}`,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        subscriptionTimestamp: new Date().toISOString()
      };
      
      console.log('🎯 Sending subscription tracking data:', enhancedReferralData);
      
      // Criar PIX usando a API da PushinPay
      const response = await fetch('/api/premium/create-pix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          value: selectedPlan.price,
          email: email,
          planId: selectedPlan.id,
          referralData: enhancedReferralData
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar PIX');
      }

      const pixResponse: PixResponse = await response.json();
      setPixData(pixResponse);
      setShowPixPayment(true);
      
      // Log de sucesso para tracking
      console.log('✅ PIX created successfully with tracking data:', {
        pixId: pixResponse.id,
        plan: selectedPlan.id,
        referralSource: enhancedReferralData.source,
        referralCampaign: enhancedReferralData.campaign
      });
      
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyPixCode = async () => {
    if (pixData?.qr_code) {
      try {
        await navigator.clipboard.writeText(pixData.qr_code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Erro ao copiar:', error);
      }
    }
  };

  const formatPrice = (price: number) => {
    return `R$ ${(price / 100).toFixed(2).replace('.', ',')}`;
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword || !email || !selectedPlan) return;
    
    if (password !== confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }
    
    if (password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres!');
      return;
    }

    setIsLoading(true);
    try {
      // Obter dados de referência do localStorage
      const storedReferralData = localStorage.getItem('referralData');
      const referralInfo = storedReferralData ? JSON.parse(storedReferralData) : referralData;
      
      // Adicionar informações extras de rastreamento para a criação da conta
      const enhancedReferralData = {
        ...referralInfo,
        planSelected: selectedPlan.id,
        planPrice: selectedPlan.price,
        pixId: pixData?.id,
        accountCreationTimestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        screenResolution: `${screen.width}x${screen.height}`,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };
      
      console.log('🎯 Creating account with subscription tracking data:', {
        email: email,
        plan: selectedPlan.id,
        referralSource: enhancedReferralData.source,
        referralCampaign: enhancedReferralData.campaign,
        pixId: pixData?.id
      });
      
      // Criar conta do usuário
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          planId: selectedPlan.id,
          pixId: pixData?.id,
          referralData: enhancedReferralData
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar conta');
      }

      const userData = await response.json();
      
      // Log de sucesso para tracking
      console.log('✅ Account created successfully with tracking data:', {
        userId: userData.user?.id,
        email: email,
        plan: selectedPlan.id,
        referralSource: enhancedReferralData.source,
        referralCampaign: enhancedReferralData.campaign
      });
      
      // Sucesso! Redirecionar para login
      alert('Conta criada com sucesso! Você será redirecionado para fazer login.');
      window.location.href = '/login';
      
    } catch (error) {
      console.error('Erro:', error);
      alert(error instanceof Error ? error.message : 'Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPlan(null);
    setShowPixPayment(false);
    setShowPasswordForm(false);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setPixData(null);
    setTimeLeft(15 * 60);
    setPaymentConfirmed(false);
    setIsCheckingPayment(false);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Funções do Slider
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % 9);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + 9) % 9);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Função para scroll suave até os planos
  const scrollToPlans = () => {
    const plansSection = document.getElementById('plans-section');
    if (plansSection) {
      plansSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Auto-play do slider
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000); // Muda a cada 3 segundos

    return () => clearInterval(interval);
  }, [currentSlide]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="text-2xl font-bold text-white">
                <Image src="/imgs/logo.png" alt="Amador Flix" width={80} height={40} className="rounded-full" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-300 hover:text-white transition">Login</Link>
              <button 
                onClick={scrollToPlans}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-medium transition"
              >
                Liberar acesso
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-black to-gray-900 py-20 overflow-hidden h-[500px]">
        {/* Background Video */}
        <div className="absolute inset-0 ">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover"
            ref={videoRef}
          >
            <source src="/cta.mp4" type="video/mp4" />
            Seu navegador não suporta vídeos.
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80"></div>
        </div>
        
        {/* Video Overlay - Click to Unmute */}
        {isMuted && (
          <div 
            className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
            onClick={toggleMute}
          >
            <div className="bg-black/50 backdrop-blur-sm rounded-full p-6 hover:bg-black/70 transition-all duration-300">
              <div className="flex items-center space-x-3 text-white">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L5.5 14H3a1 1 0 01-1-1V7a1 1 0 011-1h2.5l2.883-2.793a1 1 0 011.617.793zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.984 3.984 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                </svg>
                <span className="text-lg font-medium">Clique para ativar o som</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Content */}
        
      </section>

      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center mb-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-red-500 font-extrabold">Assine Agora</span>
          </h1>
          
          <h2 className="text-2xl md:text-4xl font-bold mb-8">
            O MELHOR DO <span className="text-red-500">CONTEÚDO</span> PREMIUM <span className="text-red-500">EXCLUSIVO</span>
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button 
              onClick={scrollToPlans}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-lg font-bold transition shadow-lg hover:shadow-red-500/25"
            >
              Liberar acesso exclusivo
            </button>
            <button className="border border-white text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-white hover:text-black transition">
              Saiba mais
            </button>
          </div>
        </div>

      {/* Seção de Benefícios */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaPlay className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">Conteúdos exclusivos</h3>
              <p className="text-gray-300">Acesse os conteúdos exclusivos para assinantes.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCrown className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">Benefícios secretos</h3>
              <p className="text-gray-300">Tenha acesso a diversos benefícios secretos.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaVideo className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">Vídeos em alta definição</h3>
              <p className="text-gray-300">Desfrute de conteúdos com qualidade ULTRA HD 4k.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-2">Navegue sem anúncios</h3>
              <p className="text-gray-300">Navegue sem anúncios, pop-up ou quaisquer distrações.</p>
            </div>
          </div>
        </div>
      </section>

     

      {/* Seção de Preview de Vídeos */}
      <section id="videos" className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Vídeos em alta</h2>
          
          {/* Slider de Vídeos */}
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }, (_, index) => (
                <div key={index} className="bg-gray-800 rounded-lg overflow-hidden">
                  <div className="relative h-48">
                    <Image 
                      src={`/imgs/capas/${String(index + 1).padStart(2, '0')}.png`}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <FaPlay className="text-white text-4xl" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
          </div>
          
          <div className="text-center mt-8">
            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded font-medium transition">
              ASSINAR AGORA
            </button>
          </div>
        </div>
      </section>

       {/* Seção de Estatísticas */}
       <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-red-500 mb-2">50k+</div>
              <div className="text-gray-300">Vídeos</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-red-500 mb-2">15k+</div>
              <div className="text-gray-300">Modelos</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-red-500 mb-2">94k+</div>
              <div className="text-gray-300">Fotos</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-red-500 mb-2">20+</div>
              <div className="text-gray-300">Categorias</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-red-500 mb-2">18066+</div>
              <div className="text-gray-300">Horas de vídeo</div>
            </div>
          </div>
        </div>
      </section>

      {/* Plano Selecionado - Se houver */}
      {selectedPlan && (
        <div className="px-4 py-4 md:px-8 md:py-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <FaCheck className="text-green-500 text-sm" />
                    <span className="text-green-400 text-sm font-medium">PLANO SELECIONADO</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{selectedPlan.title}</h3>
                  <p className="text-neutral-300 text-sm">{selectedPlan.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{formatPrice(selectedPlan.price)}</div>
                  <button
                    onClick={() => setShowModal(true)}
                    className="text-green-400 text-sm hover:text-green-300 transition"
                  >
                    Finalizar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

             {/* Seção Promocional com Benefícios */}
       <div className="px-4 py-6 md:px-8 md:py-12">
         <div className="max-w-6xl mx-auto">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
             {/* Slider com 9 Imagens */}
             <div className="relative">
               <div className="relative rounded-lg overflow-hidden">
                 <div className="w-full h-96 md:h-[500px] bg-gradient-to-br from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-lg">
                   {/* Container das imagens */}
                   <div className="relative w-full h-full">
                     {/* Imagem 1 */}
                     <div className={`absolute inset-0 transition-opacity duration-500 ${currentSlide === 0 ? 'opacity-100' : 'opacity-0'}`}>
                       <Image 
                         src="/imgs/1ad80099-466a-45c6-a058-3a45ba2679a9.png" 
                         alt="Slide 1" 
                         fill 
                         className="object-cover"
                         priority={currentSlide === 0}
                       />
                     </div>

                     {/* Imagem 2 */}
                     <div className={`absolute inset-0 transition-opacity duration-500 ${currentSlide === 1 ? 'opacity-100' : 'opacity-0'}`}>
                       <Image 
                         src="/imgs/60cfd37a-33e2-4374-9915-0975c30d2588.png" 
                         alt="Slide 2" 
                         fill 
                         className="object-cover"
                         priority={currentSlide === 1}
                       />
                     </div>

                     {/* Imagem 3 */}
                     <div className={`absolute inset-0 transition-opacity duration-500 ${currentSlide === 2 ? 'opacity-100' : 'opacity-0'}`}>
                       <Image 
                         src="/imgs/5841baad-a64a-4b36-ba92-1d251db99bf5.png" 
                         alt="Slide 3" 
                         fill 
                         className="object-cover"
                         priority={currentSlide === 2}
                       />
                     </div>

                     {/* Imagem 4 */}
                     <div className={`absolute inset-0 transition-opacity duration-500 ${currentSlide === 3 ? 'opacity-100' : 'opacity-0'}`}>
                       <Image 
                         src="/imgs/ac9f3160-70b5-42a7-9325-2580c4f7ad57.png" 
                         alt="Slide 4" 
                         fill 
                         className="object-cover"
                         priority={currentSlide === 3}
                       />
                     </div>

                     {/* Imagem 5 */}
                     <div className={`absolute inset-0 transition-opacity duration-500 ${currentSlide === 4 ? 'opacity-100' : 'opacity-0'}`}>
                       <Image 
                         src="/imgs/d835aad1-58c5-4594-8cfa-0ba295c10827.png" 
                         alt="Slide 5" 
                         fill 
                         className="object-cover"
                         priority={currentSlide === 4}
                       />
                     </div>

                     {/* Imagem 6 */}
                     <div className={`absolute inset-0 transition-opacity duration-500 ${currentSlide === 5 ? 'opacity-100' : 'opacity-0'}`}>
                       <Image 
                         src="/imgs/da51e259-dcd9-48f5-9dbd-11de53954b1a.png" 
                         alt="Slide 6" 
                         fill 
                         className="object-cover"
                         priority={currentSlide === 5}
                       />
                     </div>

                     {/* Imagem 7 */}
                     <div className={`absolute inset-0 transition-opacity duration-500 ${currentSlide === 6 ? 'opacity-100' : 'opacity-0'}`}>
                       <Image 
                         src="/imgs/fd5dac01-821f-4388-8760-beca10a9c290.png" 
                         alt="Slide 7" 
                         fill 
                         className="object-cover"
                         priority={currentSlide === 6}
                       />
                     </div>
                   </div>

                   {/* Setas de navegação */}
                   <button 
                     onClick={prevSlide}
                     className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition z-10"
                   >
                     <FaChevronLeft className="text-sm" />
                   </button>
                   <button 
                     onClick={nextSlide}
                     className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition z-10"
                   >
                     <FaChevronRight className="text-sm" />
                   </button>

                   {/* Indicadores de slide */}
                   <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                     {Array.from({ length: 7 }, (_, index) => (
                       <button
                         key={index}
                         onClick={() => goToSlide(index)}
                         className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                           currentSlide === index ? 'bg-white' : 'bg-white/50'
                         }`}
                       />
                     ))}
                   </div>
                 </div>
               </div>
             </div>

             {/* Grid de Benefícios */}
             <div className="bg-black p-6 md:p-8 rounded-lg">
               <div className="grid grid-cols-3 md:grid-cols-3 gap-4 md:gap-6">
                 {/* Linha 1 */}
                 <div className="text-center">
                   <div className="bg-red-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                     <FaUnlock className="text-white text-xl" />
                   </div>
                   <p className="text-white text-sm font-medium">Liberação de acesso imediata</p>
                 </div>
                 
                 <div className="text-center">
                   <div className="bg-red-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                     <FaShieldAlt className="text-white text-xl" />
                   </div>
                   <p className="text-white text-sm font-medium">100% Seguro e sem Anuncios</p>
                 </div>
                 
                 <div className="text-center">
                   <div className="bg-red-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                     <FaMobile className="text-white text-xl" />
                   </div>
                   <p className="text-white text-sm font-medium">Compatível com smartphone</p>
                 </div>

                 {/* Linha 2 */}
                 <div className="text-center">
                   <div className="bg-red-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                     <FaCalendarAlt className="text-white text-xl" />
                   </div>
                   <p className="text-white text-sm font-medium">Atualização diária</p>
                 </div>
                 
                 <div className="text-center">
                   <div className="bg-red-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                     <FaFire className="text-white text-xl" />
                   </div>
                   <p className="text-white text-sm font-medium">Conteúdo exclusivo</p>
                 </div>
                 
                 <div className="text-center">
                   <div className="bg-red-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                     <FaUserCircle className="text-white text-xl" />
                   </div>
                   <p className="text-white text-sm font-medium">Sigilo absoluto na hora da compra</p>
                 </div>

                 {/* Linha 3 */}
                 <div className="text-center">
                   <div className="bg-red-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                     <FaHeadphones className="text-white text-xl" />
                   </div>
                   <p className="text-white text-sm font-medium">Suporte Ativo</p>
                 </div>
                 
                 <div className="text-center">
                   <div className="bg-red-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                     <FaPlay className="text-white text-xl" />
                   </div>
                   <p className="text-white text-sm font-medium">Mais de 50.000 conteúdos exclusivos</p>
                 </div>
                 
                 <div className="text-center">
                   <div className="bg-red-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                     <FaUsers className="text-white text-xl" />
                   </div>
                   <p className="text-white text-sm font-medium">Acesso ao Canal do Telegram e ao Site</p>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </div>



      {/* Seção de Planos */}
      <section id="plans-section" className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-yellow-400">ESCOLHA A MELHOR OPÇÃO</h2>
          <p className="text-white text-center mb-12">Qual é o plano ideal para você?</p>
          
          {/* Grid de Planos Vertical */}
          <div className="max-w-2xl mx-auto space-y-3">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg transition-all duration-300 cursor-pointer hover:border-red-500/50 ${
                  selectedPlan?.id === plan.id ? 'border-green-500 bg-green-900/20' : ''
                }`}
                onClick={() => handlePlanSelect(plan)}
              >
                <div className="flex items-center p-4 md:p-6">
                  {/* Checkbox */}
                  <div className="flex items-center justify-center mr-3 md:mr-6 flex-shrink-0">
                    <div className={`w-5 h-5 md:w-6 md:h-6 rounded border-2 flex items-center justify-center transition-all duration-300 ${
                      selectedPlan?.id === plan.id 
                        ? 'border-green-500 bg-green-500' 
                        : 'border-gray-500'
                    }`}>
                      {selectedPlan?.id === plan.id && (
                        <FaCheck className="w-3 h-3 md:w-4 md:h-4 text-white" />
                      )}
                    </div>
                  </div>

                  {/* Informações do Plano */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-sm md:text-lg mb-1 truncate">{plan.title}</h3>
                    <p className="text-gray-300 text-xs md:text-sm truncate">
                      {plan.description}
                    </p>
                  </div>

                  {/* Preço e Botão - Layout Mobile */}
                  <div className="flex flex-col items-end ml-2 md:ml-6 flex-shrink-0">
                    <div className="text-lg md:text-3xl font-bold text-white mb-2 md:mb-0">
                      {formatPrice(plan.price)}
                    </div>
                    <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 md:px-6 md:py-3 rounded text-xs md:text-sm font-bold transition whitespace-nowrap">
                      QUERO ESTE PLANO
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Seção de Pagamento */}
          <div className="text-center mt-12">
            
            {/* Imagem de Segurança */}
            <div className="mt-8 flex justify-center">
              <Image 
                src="/imgs/security.webp" 
                alt="Segurança" 
                width={300} 
                height={82}
                className="opacity-80 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
          
          {/* Disclaimer */}
          <div className="text-left mt-8 text-xs text-gray-400 max-w-4xl mx-auto">
            <p>
              Planos com renovação automática para pagamentos via cartão de crédito. Cancele quando quiser. 
              Ao assinar um plano, você concorda com os nossos termos de uso e nossa política de privacidade. 
              Para solicitar cancelamento, envie um e-mail para suporte@amadorflix.com com pelo menos 48h antes da renovação do plano.
            </p>
          </div>
        </div>
      </section>


      {/* Seção FAQ */}
      <section id="duvidas" className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Dúvidas respondidas</h2>
          <p className="text-gray-400 text-center mb-12">As principais dúvidas sobre o AmadorFlix.com</p>
          
          <div className="max-w-4xl mx-auto space-y-6">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-gray-800 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-700 transition-colors"
                >
                  <span className="text-white text-lg font-medium">{faq.question}</span>
                  <div className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                    openFaq === index 
                      ? 'border-red-500 bg-red-500'
                      : 'border-gray-500'
                  }`}>
                    {openFaq === index && (
                      <FaCheck className="w-4 h-4 text-white mx-auto mt-0.5" />
                    )}
                  </div>
                </button>
                
                {/* Resposta */}
                <div className={`overflow-hidden transition-all mt-4 duration-500 ease-in-out ${
                  openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="px-6 pb-6">
                    <div className="bg-gray-700 rounded-lg p-4">
                      <p className="text-gray-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-400 mb-4">Minha dúvida não está aqui, e agora?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://t.me/@SuporteAssinante" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-medium transition">
                Acessar Suporte
              </a>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <button 
              onClick={scrollToPlans}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-lg font-bold transition"
            >
              Liberar acesso exclusivo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold text-xl mb-4">Amador Flix</h3>
              <p className="text-gray-400 text-sm">
                A melhor plataforma de conteúdo exclusivo com total privacidade e segurança.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Links Úteis</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition text-sm">Suporte</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition text-sm">Termos e condições de uso</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition text-sm">Política de privacidade</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition text-sm">Remover conteúdo</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Contato</h4>
              <ul className="space-y-2">
                <li><a href="https://t.me/@SuporteAssinante" className="text-gray-400 hover:text-white transition text-sm">Suporte Telegram</a></li>
                <li><a href="mailto:suporte@amadorflix.com" className="text-gray-400 hover:text-white transition text-sm">suporte@amadorflix.com</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Redes Sociais</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <FaComments className="text-xl" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-4">
                É proibida a reprodução do conteúdo desta página e de todo o conteúdo exclusivo para assinantes em qualquer meio de comunicação, 
                sem autorização escrita do 'Amador Flix' ou do detentor do copyright. Os textos e as imagens (fotos, vídeos, etc.) 
                de todas as Atrações do 'Amador Flix' são protegidas pela LEI DO DIREITO AUTORAL, não sendo permitidas cópias ou divulgações 
                por qualquer motivo ou justificativa, nem mesmo com autorização das(os) modelos. Infratores serão punidos na forma da lei.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <p className="text-white font-bold">Amador Flix</p>
                <p className="text-gray-400 text-sm">AmadorFlix.com © 2025 - Todos os direitos reservados</p>
                <p className="text-gray-400 text-sm font-bold">Site destinado à maiores de 18 anos</p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="max-w-md w-full bg-neutral-900 rounded-lg border border-neutral-700 max-h-[90vh] overflow-y-auto">
            {/* Header do Modal */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-700">
              <h2 className="text-xl font-bold text-white">
                {showPasswordForm ? 'Criar Conta' : showPixPayment ? 'Pagamento PIX' : 'Finalizar Assinatura'}
              </h2>
              <button
                onClick={closeModal}
                className="text-neutral-400 hover:text-white transition"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6">
              {showPasswordForm ? (
                // Formulário de criação de senha
                <div>
                  <div className="text-center mb-6">
                    <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <FaCheck className="text-green-500" />
                        <span className="text-green-400 font-bold">Pagamento Confirmado!</span>
                      </div>
                      <h3 className="text-lg font-bold text-white">{selectedPlan?.title}</h3>
                      <p className="text-neutral-300 text-sm">{selectedPlan?.description}</p>
                      <div className="text-2xl font-bold text-white mt-2">
                        {selectedPlan && formatPrice(selectedPlan.price)}
                      </div>
                    </div>
                    
                    <p className="text-white text-sm">
                      Agora crie sua senha para finalizar o cadastro e acessar imediatamente!
                    </p>
                  </div>

                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
                        E-mail (já preenchido)
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        disabled
                        className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-lg text-neutral-300 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-white text-sm font-medium mb-2">
                        Criar Senha
                      </label>
                      <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:border-red-500"
                        placeholder="Digite sua senha (mínimo 6 caracteres)"
                        required
                        minLength={6}
                      />
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-white text-sm font-medium mb-2">
                        Confirmar Senha
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:border-red-500"
                        placeholder="Confirme sua senha"
                        required
                        minLength={6}
                      />
                    </div>

                    <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                      <p className="text-green-300 text-sm">
                        Sua conta será criada e você terá acesso imediato ao conteúdo premium!
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Criando conta...
                        </>
                      ) : (
                        'Criar Conta e Acessar'
                      )}
                    </button>
                  </form>
                </div>
              ) : showPixPayment && pixData ? (
                // Tela de pagamento PIX com verificação automática
                <PixPaymentWithAutoCheck
                  pixData={pixData}
                  userEmail={email}
                  onClose={() => {
                    setShowPixPayment(false);
                    setPixData(null);
                  }}
                />
              ) : (
                // Formulário de email
                <div>
                  <div className="text-center mb-6">
                    <div className="bg-neutral-800 rounded-lg p-4 mb-4">
                      <h3 className="text-lg font-bold text-white">{selectedPlan?.title}</h3>
                      <p className="text-neutral-300 text-sm">{selectedPlan?.description}</p>
                      <div className="text-2xl font-bold text-white mt-2">
                        {selectedPlan && formatPrice(selectedPlan.price)}
                      </div>
                    </div>
                    

                  </div>

                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
                        Seu E-mail
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:border-red-500"
                        placeholder="Digite seu e-mail"
                        required
                      />
                    </div>

                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
                      <p className="text-blue-300 text-sm">
                        Seu e-mail está 100% seguro, usaremos apenas para identificar seu cadastro e processar a assinatura.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Processando...
                        </>
                      ) : (
                        'Gerar PIX'
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 