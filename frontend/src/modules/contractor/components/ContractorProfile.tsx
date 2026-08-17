import React from 'react';
import { professionalMockService } from '../../../services/api/professionalMockService';
import { Star, CheckCircle2, Award, FileText } from 'lucide-react';

export const ProProfile: React.FC = () => {
  const profile = professionalMockService.getProfile();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Bio, Profile details, Skills */}
      <div className="lg:col-span-2 space-y-6">
        {/* Info card */}
        <div className="bg-white border border-brandLight-border p-6 rounded-3xl space-y-4 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-slate-700 text-lg uppercase">
              {profile.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-black text-brandDark-black">{profile.name}</h2>
                <span className="flex items-center space-x-0.5 px-2 py-0.5 bg-green-50 text-green-700 rounded-full border border-green-200 text-[8px] font-black uppercase tracking-wider">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Verified</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 font-bold mt-0.5">{profile.title}</p>
              <div className="flex items-center space-x-1.5 text-xs text-yellow-500 font-black mt-1">
                <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                <span>{profile.rating} • {profile.reviewsCount} Client Reviews</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed font-bold border-t border-slate-100 pt-4">
            {profile.bio}
          </p>
        </div>

        {/* Certifications and credentials */}
        <div className="bg-white border border-brandLight-border p-6 rounded-3xl space-y-4 shadow-sm">
          <h3 className="text-xs font-black text-brandDark-black uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center space-x-2">
            <Award className="w-4 h-4 text-primary" />
            <span>Credentials & Certifications</span>
          </h3>
          <div className="space-y-3">
            {profile.certifications.map((c, i) => (
              <div key={i} className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center text-xs font-bold text-slate-500">
                <div className="space-y-1">
                  <span className="text-brandDark-black font-black block leading-none">{c.title}</span>
                  <span className="text-[9px] text-slate-400 font-bold block">{c.issuer}</span>
                </div>
                <span className="text-brandDark-black font-black font-mono">{c.year}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Tag Cloud */}
        <div className="bg-white border border-brandLight-border p-6 rounded-3xl space-y-4 shadow-sm">
          <h3 className="text-xs font-black text-brandDark-black uppercase tracking-wider pb-2 border-b border-slate-100">
            Skills & Expertise
          </h3>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((s, i) => (
              <span key={i} className="px-3.5 py-2 bg-slate-50 border border-slate-100 hover:border-slate-200 text-slate-600 rounded-2xl text-xs font-bold transition-all">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Verification Level & Services */}
      <div className="space-y-6">
        {/* Verification Status Details */}
        <div className="bg-white border border-brandLight-border p-6 rounded-3xl space-y-4 shadow-sm">
          <h3 className="text-xs font-black text-brandDark-black uppercase tracking-wider pb-2 border-b border-slate-100">
            Professional Verification
          </h3>
          <div className="space-y-3.5 text-xs font-bold text-slate-500">
            <div className="flex justify-between items-center">
              <span>National ID Check</span>
              <span className="text-green-600 font-black">Passed ✓</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Council License Verification</span>
              <span className="text-green-600 font-black">Verified ✓</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Previous Experience check</span>
              <span className="text-green-600 font-black">Approved ✓</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Portfolio ownership check</span>
              <span className="text-green-600 font-black">Passed ✓</span>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center space-x-2 text-[10px] text-green-700 bg-green-50/50 p-3 rounded-2xl border border-green-200 uppercase font-black">
              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span>Verified BuildPilot Pro</span>
            </div>
          </div>
        </div>

        {/* Services pricing catalog */}
        <div className="bg-white border border-brandLight-border p-6 rounded-3xl space-y-4 shadow-sm">
          <h3 className="text-xs font-black text-brandDark-black uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center space-x-2">
            <FileText className="w-4 h-4 text-primary" />
            <span>Offered Services & Pricing</span>
          </h3>
          <div className="space-y-3.5 text-xs font-bold text-slate-500">
            {profile.services.map((s, i) => (
              <div key={i} className="flex justify-between items-center">
                <span>{s.name}</span>
                <span className="text-brandDark-black font-black font-mono">{s.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
