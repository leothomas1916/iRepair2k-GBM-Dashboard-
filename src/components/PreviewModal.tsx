import { motion, AnimatePresence } from "motion/react";
import { X, MoreVertical, Smartphone, Share2 } from "lucide-react";
import { GBPPost } from "../types";
import Markdown from "react-markdown";

interface Props {
  post: GBPPost;
  imageUrl: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PreviewModal({ post, imageUrl, isOpen, onClose }: Props) {
  if (!isOpen) return null;

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date());

  const fullContent = `${post.hook}\n\n${post.body}\n\nBenefits:\n${Array.isArray(post.benefits) ? post.benefits.map(b => `- ${b}`).join("\n") : ""}\n\n${Array.isArray(post.hashtags) ? post.hashtags.map((tag: string) => tag.startsWith("#") ? tag : `#${tag}`).join(" ") : ""}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-zinc-100 flex items-center justify-between p-4 border-b border-zinc-200 shrink-0">
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-zinc-600" />
              <span className="font-semibold text-sm text-zinc-800">Mobile Preview</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-zinc-200 rounded-full transition-colors text-zinc-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto bg-zinc-100 p-4" style={{ scrollbarWidth: 'thin' }}>
            {/* GBP Post Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
              <div className="p-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
                    iR
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-900 leading-tight">iRepair2k</h3>
                    <p className="text-xs text-zinc-500">{formattedDate}</p>
                  </div>
                </div>
                <button className="text-zinc-400 hover:text-zinc-600">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              {/* Text Content */}
              <div className="px-4 pb-3">
                <div className="text-[14px] text-zinc-800 leading-snug whitespace-pre-wrap line-clamp-4">
                  {fullContent}
                </div>
              </div>

              {/* Image */}
              <div className="w-full aspect-square bg-zinc-100 border-y border-zinc-100 relative">
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-zinc-900 text-[10px] font-bold px-2.5 py-1 rounded shadow-sm z-10 uppercase tracking-widest border border-black/5 flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${post.postType === "Special Offer" ? "bg-red-500" : post.postType === "Event / Workshops" ? "bg-blue-500" : post.postType === "Festival Poster" ? "bg-purple-500" : "bg-emerald-500"}`}></div>
                  {post.postType === "Special Offer" ? "Offer" : post.postType === "Event / Workshops" ? "Event" : post.postType === "Festival Poster" ? "Festival" : "Update"}
                </div>
                {imageUrl ? (
                  <img src={imageUrl} alt="Post" className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 p-6 text-center bg-zinc-100">
                    <span className="text-xs italic">Image generation required to display visual</span>
                  </div>
                )}
              </div>

              {/* CTA Button & Actions */}
              <div className="p-4 flex flex-col gap-4">
                <button className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors text-center shadow-sm">
                  {post.cta || "Learn more"}
                </button>

                <div className="flex items-center justify-end gap-5 border-t border-zinc-100 pt-3">
                  <button className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-700 text-sm font-medium">
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
