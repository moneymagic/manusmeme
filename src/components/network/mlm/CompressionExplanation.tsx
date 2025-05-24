
import React from 'react';

const CompressionExplanation: React.FC = () => {
  return (
    <>
      <div className="p-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg mt-6 border border-white/10">
        <p className="text-white text-center">
          Network depth is unlimited: commissions flow up line by line until reaching qualified ranks
        </p>
      </div>
      
      <div className="mt-6">
        <h3 className="text-white font-semibold mb-3">How Top-Down Compression Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-black/40 rounded-lg p-4 border border-white/10">
            <h4 className="text-white font-medium mb-2">Complete Distribution</h4>
            <p className="text-gray-300 text-sm">
              The system always attempts to distribute commissions starting from the V1 level upward.
              If a member doesn't qualify for their rank's commission, that commission "compresses"
              upward to the next qualified member in the upline.
            </p>
          </div>
          <div className="bg-black/40 rounded-lg p-4 border border-white/10">
            <h4 className="text-white font-medium mb-2">Rank Benefits</h4>
            <p className="text-gray-300 text-sm">
              Higher ranks receive substantially higher percentages. Members must qualify for each rank
              to receive its commission. This creates strong incentives for rank advancement and team building.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompressionExplanation;
