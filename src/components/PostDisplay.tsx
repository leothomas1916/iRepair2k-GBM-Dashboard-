/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Copy, Camera, Terminal, MousePointer2, CheckCircle2, Tag, Calendar, Clock, Ticket, Laptop, Smartphone, Monitor, Cpu, Loader2, Download, Search, Info, Share2, LogIn, Eye } from "lucide-react";
import { GBPPost, PostType } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { generateImage } from "../services/postService";
import Markdown from "react-markdown";
import { signInWithGoogle } from "../firebase";
import { GoogleAuthProvider } from "firebase/auth";
import PreviewModal from "./PreviewModal";

interface Props {
  post: GBPPost | null;
}

const BRAND_CONFIG: Record<string, { icon: any, color: string, label: string }> = {
  apple: { icon: Cpu, color: "text-zinc-100", label: "Apple" },
  macbook: { icon: Laptop, color: "text-zinc-100", label: "MacBook" },
  iphone: { icon: Smartphone, color: "text-orange-500", label: "iPhone" },
  samsung: { icon: Smartphone, color: "text-blue-500", label: "Samsung" },
  google: { icon: Smartphone, color: "text-red-500", label: "Pixel" },
  pixel: { icon: Smartphone, color: "text-red-500", label: "Pixel" },
  dell: { icon: Monitor, color: "text-blue-500", label: "Dell" },
  hp: { icon: Monitor, color: "text-blue-400", label: "HP" },
  lenovo: { icon: Monitor, color: "text-red-500", label: "Lenovo" },
  asus: { icon: Cpu, color: "text-blue-600", label: "ASUS" },
  acer: { icon: Laptop, color: "text-emerald-500", label: "Acer" },
  windows: { icon: Monitor, color: "text-blue-400", label: "Windows" },
};

export default function PostDisplay({ post }: Props) {
  const [copied, setCopied] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  
  const [googleTokens, setGoogleTokens] = useState<any>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState<"idle" | "success" | "error">("idle");
  const [publishMessage, setPublishMessage] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    setImageUrl(null);
    setImageError(null);
    if (post && !isGeneratingImage && !imageUrl) {
      handleGenerateImage();
    }
  }, [post]);

  const handleConnectGoogle = async () => {
    try {
      const result = await signInWithGoogle();
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        setGoogleTokens({ access_token: credential.accessToken });
      }
    } catch (error) {
      console.error('Firebase OAuth error:', error);
      alert('Failed to initiate login.');
    }
  };

  const handlePublishToGBP = async () => {
    if (!post || !googleTokens) return;
    setIsPublishing(true);
    setPublishStatus("idle");
    setPublishMessage(null);

    const details = post.offerDetails ? `\nOFFER: ${post.offerDetails.discountValue} OFF with code ${post.offerDetails.couponCode}\nExpires: ${post.offerDetails.expiryDate}` : post.eventDetails ? `\nEVENT: ${post.eventDetails.title}\nDate: ${post.eventDetails.dateRange}` : "";
    const tags = `\n\n${Array.isArray(post.hashtags) ? post.hashtags.map(t => t.startsWith("#") ? t : `#${t}`).join(" ") : ""}`;
    const fullContent = `${post.hook}\n\n${post.body}${details}\n\nBenefits:\n${Array.isArray(post.benefits) ? post.benefits.map(b => `- ${b}`).join("\n") : ""}${tags}`;

    try {
      const response = await fetch('/api/publish-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokens: googleTokens,
          content: fullContent,
          imageUrl: imageUrl
        })
      });

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Server returned non-JSON (${response.status})`);
      }

      if (!response.ok) {
        throw new Error(data?.error || "Failed to publish post.");
      }

      setPublishStatus("success");
      setPublishMessage("Post accurately published to Google Business!");
    } catch (error: any) {
      console.error(error);
      setPublishStatus("error");
      setPublishMessage(error.message || "Failed to publish.");
    } finally {
      setIsPublishing(false);
    }
  };

  if (!post) {
    return (
      <div className="h-full min-h-[600px] flex flex-col items-center justify-center text-zinc-500 space-y-5 border border-dashed border-zinc-800 rounded-2xl p-12 bg-zinc-900/10">
        <div className="bg-zinc-900 p-5 rounded-full border border-zinc-800/80">
          <Terminal className="w-8 h-8 opacity-40 text-orange-500" />
        </div>
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-center leading-relaxed">
          Waiting for instructions...<br/>
          <span className="opacity-50 tracking-wider">Output rendering pipeline</span>
        </p>
      </div>
    );
  }

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleGenerateImage = async () => {
    if (!post) return;
    setIsGeneratingImage(true);
    setImageError(null);
    try {
      const url = await generateImage(post.imagePrompt);
      setImageUrl(url);
    } catch (err: any) {
      console.error(err);
      setImageError(err.message || "Failed to generate image");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!imageUrl) return;
    const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
    const link = document.createElement('a');
    link.href = proxyUrl;
    link.download = `irepair2k-visual-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getBrandLogo = (text: string) => {
    const lowerText = text.toLowerCase();
    const brandKey = Object.keys(BRAND_CONFIG).find(brand => lowerText.includes(brand));
    return brandKey ? BRAND_CONFIG[brandKey] : null;
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={post.hook + post.postType}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="glass-card shadow-2xl"
      >
        <div className="p-6 md:p-8 space-y-10 relative z-10">
          
          <header className="flex items-center justify-between border-bottom pb-4 border-b border-zinc-800/50">
            <div className="flex items-center gap-2">
              {post.postType === PostType.OFFER && <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5"><Tag className="w-3.5 h-3.5"/> Active Offer</div>}
              {post.postType === PostType.EVENT && <div className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5"/> Limited Event</div>}
              {post.postType === PostType.UPDATE && <div className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5"/> Tech Update</div>}
            </div>
            <div className="flex items-center -space-x-1.5 opacity-80 hover:opacity-100 transition-opacity">
              {["Apple", "Samsung", "Dell", "HP"].map((brand) => {
                const config = BRAND_CONFIG[brand.toLowerCase()];
                const Icon = config.icon;
                return (
                  <div key={brand} className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center shadow-md">
                    <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                  </div>
                );
              })}
            </div>
          </header>

          <section className="bg-zinc-950/50 rounded-2xl border border-zinc-800/60 overflow-hidden">
            <div className="px-5 py-3 border-b border-zinc-800/60 flex items-center justify-between bg-zinc-900/30">
              <h3 className="text-[11px] font-mono font-medium text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <Camera className="w-4 h-4 text-orange-500" /> Media Identity
              </h3>
              <div className="flex items-center gap-2">
                {imageUrl && (
                  <button onClick={handleDownloadImage} className="p-1.5 hover:bg-zinc-800 rounded-md transition-colors text-zinc-400 hover:text-white" title="Download Image">
                    <Download className="w-4 h-4" />
                  </button>
                )}
                <button onClick={handleGenerateImage} disabled={isGeneratingImage} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md transition-all text-xs font-medium border border-zinc-700 disabled:opacity-50">
                  {isGeneratingImage ? <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-500" /> : <Camera className="w-3.5 h-3.5 text-zinc-400" />}
                  {imageUrl ? "Regenerate" : "Generate Image"}
                </button>
                <button onClick={() => handleCopy(post.imagePrompt, "image")} className="p-1.5 hover:bg-zinc-800 rounded-md transition-colors text-zinc-400 hover:text-white">
                  {copied === "image" ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              {imageUrl ? (
                <div className="space-y-4">
                  <div className="aspect-square w-full relative group">
                    <img src={imageUrl} alt="AI Generation" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent pointer-events-none" />
                  </div>
                  <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl mx-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                       <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Image Generation Prompt</h4>
                       <button onClick={() => handleCopy(post.imagePrompt, "prompt_text")} className="text-zinc-500 hover:text-white transition-colors">
                         {copied === "prompt_text" ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                       </button>
                    </div>
                    <p className="text-xs text-zinc-400 italic">"{post.imagePrompt}"</p>
                  </div>
                </div>
              ) : (
                <div className="p-6 md:p-8">
                  <p className="text-sm leading-relaxed text-zinc-300 font-medium italic">"{post.imagePrompt}"</p>
                  {imageError && <p className="mt-4 text-xs text-red-400 font-mono tracking-wide">{imageError}</p>}
                </div>
              )}
            </div>
          </section>

          {(post.offerDetails || post.eventDetails) && (
            <section className="grid grid-cols-1 gap-4">
              {post.offerDetails && (
                <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-900/5 border border-emerald-500/20 flex flex-col sm:flex-row items-center gap-6">
                  <div className="bg-emerald-500/20 p-4 rounded-full"><Ticket className="w-7 h-7 text-emerald-400" /></div>
                  <div className="flex-1 text-center sm:text-left">
                    <div className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest mb-1.5">Coupon Active</div>
                    <div className="text-xl font-display font-bold text-white tracking-wide">{post.offerDetails.discountValue} Off</div>
                    <div className="text-sm text-emerald-200/70 mt-1 font-medium">Expires: {post.offerDetails.expiryDate}</div>
                  </div>
                  <code className="px-5 py-2.5 bg-emerald-950/50 border border-emerald-500/30 rounded-xl text-emerald-400 font-mono font-bold tracking-widest text-lg select-all cursor-copy">
                    {post.offerDetails.couponCode}
                  </code>
                </div>
              )}
            </section>
          )}

          <section className="space-y-6">
            <h2 className="text-2xl font-display font-bold text-white tracking-tight leading-snug">
              {post.hook}
            </h2>
            
            <div className="prose prose-invert max-w-none text-[15px] leading-relaxed text-zinc-300 font-medium prose-headings:font-display prose-headings:font-bold prose-headings:text-white prose-a:text-orange-400 prose-strong:text-zinc-100">
              <Markdown>{post.body}</Markdown>
            </div>

            {post.geoOptimization && (
              <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-5 flex items-start gap-4">
                <Search className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h5 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">GEO Strategy Applied</h5>
                  <p className="text-xs text-zinc-300 leading-relaxed">{post.geoOptimization}</p>
                </div>
              </div>
            )}

            <div className="pt-2">
              <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-3 border-b border-zinc-800/50 pb-2">Technical Capabilities</h4>
              <ul className="grid gap-2.5">
                {Array.isArray(post.benefits) && post.benefits.map((benefit, i) => {
                  const brandLogo = getBrandLogo(benefit);
                  const Icon = brandLogo?.icon;
                  return (
                    <motion.li key={i} className="flex items-start gap-3.5 text-sm text-zinc-300 p-2.5 rounded-lg bg-zinc-900/30 hover:bg-zinc-900/70 border border-zinc-800/30 transition-colors">
                      {Icon ? (
                        <div className="mt-0.5"><Icon className={`w-4 h-4 ${brandLogo?.color}`} /></div>
                      ) : (
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500/80 shrink-0" />
                      )}
                      <span className="leading-relaxed">{benefit}</span>
                    </motion.li>
                  );
                })}
              </ul>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {Array.isArray(post.hashtags) ? post.hashtags.map((tag, i) => (
                <span key={i} className="text-xs font-medium text-zinc-400 hover:text-orange-400 cursor-default transition-colors">
                  {tag.startsWith("#") ? tag : `#${tag}`}
                </span>
              )) : typeof post.hashtags === 'string' ? (post.hashtags as string).split(' ').map((tag, i) => (
                <span key={i} className="text-xs font-medium text-zinc-400 hover:text-orange-400 cursor-default transition-colors">
                  {tag.startsWith("#") ? tag : `#${tag}`}
                </span>
              )) : null}
            </div>

            {Array.isArray(post.geoTags) && post.geoTags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2 pb-6 border-b border-zinc-800/50">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mr-1 self-center">Targets:</span>
                {post.geoTags.map((tag, i) => (
                  <span key={i} className="bg-zinc-800/50 text-zinc-300 border border-zinc-700/50 px-2 py-0.5 rounded text-[10px] font-mono whitespace-nowrap">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 px-5 py-2.5 bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-lg font-bold text-sm">
                <MousePointer2 className="w-4 h-4" />
                <span>CTA: {post.cta}</span>
              </div>
              <button 
                onClick={() => setIsPreviewOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-colors text-sm font-medium"
              >
                <Eye className="w-4 h-4" />
                Preview in Maps
              </button>
              <button 
                onClick={() => {
                  const tags = `\n\n${Array.isArray(post.hashtags) ? post.hashtags.map(t => t.startsWith("#") ? t : `#${t}`).join(" ") : ""}`;
                  handleCopy(`${post.hook}\n\n${post.body}\n\nBenefits:\n${Array.isArray(post.benefits) ? post.benefits.map(b => `- ${b}`).join("\n") : ""}${tags}\n\nCTA: ${post.cta}`, "full");
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-white transition-colors text-sm font-medium"
              >
                {copied === "full" ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-zinc-400" />}
                {copied === "full" ? "Copied to Clipboard" : "Copy Content"}
              </button>
            </div>

            <div className="pt-8">
              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-5 shadow-inner">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-orange-500" /> Production Release
                    </h4>
                    <p className="text-xs text-zinc-400 mt-1">Deploy this content directly to your Google Business Profile.</p>
                  </div>
                  {!googleTokens ? (
                    <button onClick={handleConnectGoogle} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium text-sm">
                      <LogIn className="w-4 h-4" /> Connect
                    </button>
                  ) : (
                    <button onClick={handlePublishToGBP} disabled={isPublishing} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors font-medium text-sm disabled:opacity-50">
                      {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />} Publish Post
                    </button>
                  )}
                </div>

                {publishMessage && (
                  <div className={`p-5 rounded-xl border flex flex-col gap-3 text-sm ${publishStatus === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>
                    <div className="flex items-start gap-3">
                      {publishStatus === "success" ? <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" /> : <Info className="w-5 h-5 shrink-0 mt-0.5" />}
                      <span className="break-words leading-relaxed">{publishMessage}</span>
                    </div>
                    {publishStatus === "error" && publishMessage.includes("RATE_LIMIT_EXCEEDED") && (
                      <div className="mt-2 pl-8 text-xs opacity-90 border-t border-red-500/20 pt-3">
                        <p className="mb-2 font-medium"><strong>Google Business Profile API requires approval.</strong> Even though the API is enabled, Google sets the quota to 0 until your application is formally approved.</p>
                        <a 
                          href="https://support.google.com/business/contact/business_api_callbacks"
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 mt-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg font-bold transition-colors"
                        >
                          Apply for GBP API Access &rarr;
                        </a>
                      </div>
                    )}
                    {publishStatus === "error" && !publishMessage.includes("RATE_LIMIT_EXCEEDED") && (publishMessage.includes("mybusinessaccountmanagement") || publishMessage.includes("Google Business")) && (
                      <div className="mt-2 pl-8 border-t border-red-500/20 pt-3">
                        <a 
                          href="https://console.cloud.google.com/apis/library"
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg text-xs font-bold transition-colors"
                        >
                          Enable API in Google Cloud Console &rarr;
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
        
        <PreviewModal 
          post={post}
          imageUrl={imageUrl}
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
        />
      </motion.div>
    </AnimatePresence>
  );
}
