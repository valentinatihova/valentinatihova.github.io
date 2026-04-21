import React, { useEffect, useMemo, useState } from 'react';

interface FeedEntry {
  time: string;
  amountMl: number;
}

interface Point {
  x: number;
  y: number;
}

const feedingData: FeedEntry[] = [
  { time: '00:50', amountMl: 180 },
  { time: '03:43', amountMl: 90 },
  { time: '09:15', amountMl: 120 },
  { time: '11:00', amountMl: 60 },
  { time: '12:55', amountMl: 120 },
  { time: '16:00', amountMl: 120 },
  { time: '19:30', amountMl: 180 },
  { time: '21:50', amountMl: 120 },
];

const chartSize = 960;
const posterHeight = 1100;
const center = chartSize / 2;

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const polarToCartesian = (radius: number, angleDeg: number) => {
  const radians = (angleDeg - 90) * (Math.PI / 180);
  return {
    x: center + radius * Math.cos(radians),
    y: center + radius * Math.sin(radians),
  };
};

const buildClosedWavePath = (points: Point[]) => {
  if (points.length === 0) return '';

  const midpoint = (a: Point, b: Point) => ({
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  });

  const firstMidpoint = midpoint(points[points.length - 1], points[0]);
  let path = `M ${firstMidpoint.x} ${firstMidpoint.y}`;

  points.forEach((point, index) => {
    const nextPoint = points[(index + 1) % points.length];
    const nextMidpoint = midpoint(point, nextPoint);
    path += ` Q ${point.x} ${point.y} ${nextMidpoint.x} ${nextMidpoint.y}`;
  });

  return `${path} Z`;
};

const formatHourLabel = (hour: number) => {
  if (hour === 0) return 'Midnight';
  if (hour === 12) return 'Noon';
  if (hour < 12) return `${hour} AM`;
  return `${hour - 12} PM`;
};

const formatMinutesDuration = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
};

export const FeedingClockInfographic: React.FC = () => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(new Date());
    }, 60_000);

    return () => window.clearInterval(intervalId);
  }, []);

  const summary = useMemo(() => {
    const minutes = feedingData.map((entry) => toMinutes(entry.time));
    const totalMl = feedingData.reduce((sum, entry) => sum + entry.amountMl, 0);
    const averageMl = Math.round(totalMl / feedingData.length);

    const intervals = minutes.map((minute, index) => {
      const nextMinute = index === minutes.length - 1 ? minutes[0] + 24 * 60 : minutes[index + 1];
      return nextMinute - minute;
    });

    const averageIntervalMinutes = Math.round(
      intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length
    );

    const longestGap = Math.max(...intervals);

    return {
      totalMl,
      averageMl,
      averageIntervalLabel: formatMinutesDuration(averageIntervalMinutes),
      longestGapLabel: formatMinutesDuration(longestGap),
      scheduleMinutes: minutes,
    };
  }, []);

  const liveStats = useMemo(() => {
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const nextFeedIndex = summary.scheduleMinutes.findIndex((minute) => minute > currentMinutes);
    const resolvedIndex = nextFeedIndex === -1 ? 0 : nextFeedIndex;
    const nextFeedMinutes =
      nextFeedIndex === -1 ? summary.scheduleMinutes[0] + 24 * 60 : summary.scheduleMinutes[resolvedIndex];

    return {
      currentTimeLabel: now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
      nextFeedTime: feedingData[resolvedIndex].time,
      nextFeedLabel: formatMinutesDuration(nextFeedMinutes - currentMinutes),
      currentAngle: (currentMinutes / (24 * 60)) * 360,
    };
  }, [now, summary.scheduleMinutes]);

  const hourMarks = Array.from({ length: 24 }, (_, hour) => {
    const angle = (hour / 24) * 360;
    return {
      hour,
      inner: polarToCartesian(hour % 3 === 0 ? 332 : 344, angle),
      outer: polarToCartesian(374, angle),
      labelPosition: polarToCartesian(412, angle),
    };
  });

  const feeds = feedingData.map((entry) => {
    const minute = toMinutes(entry.time);
    const angle = (minute / (24 * 60)) * 360;
    const volumeRadius = 248 + ((entry.amountMl - 60) / 120) * 112;

    return {
      ...entry,
      angle,
      innerMarker: polarToCartesian(208, angle),
      timeLabelPoint: polarToCartesian(182, angle),
      volumePoint: polarToCartesian(volumeRadius, angle),
      amountLabelPoint: polarToCartesian(volumeRadius + 24, angle),
    };
  });

  const wavePath = buildClosedWavePath(feeds.map((feed) => feed.volumePoint));
  const currentTimeHand = polarToCartesian(356, liveStats.currentAngle);

  return (
    <div className="not-prose my-12">
      <div className="overflow-hidden rounded-[2rem] border border-[#c5b89e] bg-[#f7efd9] shadow-[0_35px_90px_rgba(0,0,0,0.18)]">
        <div className="bg-[#37486f] px-6 py-5 text-[#f6f0e3] md:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.32em] text-[#cfd9ef]">
                Feeding visualization
              </p>
              <h2 className="mt-2 font-serif text-2xl md:text-3xl">Last 24 Hours</h2>
            </div>

            <div className="rounded-2xl border border-[#6b7fae] bg-[#2f3c60] px-5 py-4 text-right shadow-sm md:min-w-[320px]">
              <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#cfd9ef]">Current time</div>
              <div className="mt-2 font-serif text-3xl text-[#fff7ec]">{liveStats.currentTimeLabel}</div>
              <div className="mt-2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.1em] text-[#dbe4f8] md:text-[11px]">
                Next feed ~ {liveStats.nextFeedTime} in {liveStats.nextFeedLabel}
              </div>
            </div>
          </div>
        </div>

        <div className="px-2 py-4 md:px-6 md:py-8">
          <div>
            <svg
              viewBox={`0 0 ${chartSize} ${posterHeight}`}
              className="mx-auto block h-auto w-full max-w-[960px]"
              role="img"
              aria-label="24-hour feeding visualization with radial volume wave"
            >
              <rect x="0" y="0" width={chartSize} height={posterHeight} fill="#f7efd9" />

              {/* One calm outer ring — no city silhouette, no multi-tone “sky” wedges */}
              <circle cx={center} cy={center} r="418" fill="none" stroke="#cbb89a" strokeWidth="14" opacity="0.95" />
              <circle cx={center} cy={center} r="400" fill="none" stroke="#e8dcc4" strokeWidth="1" opacity="0.85" />

              <circle cx={center} cy={center} r="392" fill="none" stroke="#e5d8bc" strokeWidth="2" />
              <circle cx={center} cy={center} r="356" fill="none" stroke="#d6c8aa" strokeWidth="1.5" strokeDasharray="6 10" />
              <circle cx={center} cy={center} r="304" fill="none" stroke="#d6c8aa" strokeWidth="1.5" strokeDasharray="6 10" />
              <circle cx={center} cy={center} r="248" fill="none" stroke="#d6c8aa" strokeWidth="1.5" strokeDasharray="6 10" />
              <circle cx={center} cy={center} r="208" fill="none" stroke="#d9ccaf" strokeWidth="54" />
              <circle cx={center} cy={center} r="116" fill="#f4ead4" stroke="#d9ccaf" strokeWidth="1.5" />

              <path d={wavePath} fill="#6b84ba" fillOpacity="0.16" stroke="#516a9d" strokeWidth="3.5" />

              <line
                x1={center}
                y1={center}
                x2={currentTimeHand.x}
                y2={currentTimeHand.y}
                stroke="#425986"
                strokeWidth="2"
                strokeDasharray="5 7"
                opacity="0.8"
              />
              <circle cx={currentTimeHand.x} cy={currentTimeHand.y} r="7" fill="#425986" />

              {hourMarks.map((mark) => (
                <g key={mark.hour}>
                  <line
                    x1={mark.inner.x}
                    y1={mark.inner.y}
                    x2={mark.outer.x}
                    y2={mark.outer.y}
                    stroke="#8594b8"
                    strokeWidth={mark.hour % 3 === 0 ? 2 : 1}
                    opacity={mark.hour % 3 === 0 ? 0.9 : 0.5}
                  />
                  {mark.hour % 3 === 0 && (
                    <text
                      x={mark.labelPosition.x}
                      y={mark.labelPosition.y}
                      fill="#32415e"
                      fontSize="16"
                      fontWeight="600"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      stroke="#f7efd9"
                      strokeWidth="4"
                      paintOrder="stroke"
                      className="font-mono"
                    >
                      {formatHourLabel(mark.hour)}
                    </text>
                  )}
                </g>
              ))}

              {feeds.map((feed) => (
                <g key={`${feed.time}-${feed.amountMl}`}>
                  <line
                    x1={feed.innerMarker.x}
                    y1={feed.innerMarker.y}
                    x2={feed.volumePoint.x}
                    y2={feed.volumePoint.y}
                    stroke="#a8b4d1"
                    strokeWidth="1.5"
                    opacity="0.85"
                  />
                  <circle cx={feed.innerMarker.x} cy={feed.innerMarker.y} r="6" fill="#4f6698" />
                  <circle cx={feed.volumePoint.x} cy={feed.volumePoint.y} r="7" fill="#516a9d" />

                  <text
                    x={feed.timeLabelPoint.x}
                    y={feed.timeLabelPoint.y}
                    fill="#665d54"
                    fontSize="11.5"
                    fontWeight="600"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="font-mono"
                  >
                    {feed.time}
                  </text>

                  <text
                    x={feed.amountLabelPoint.x}
                    y={feed.amountLabelPoint.y}
                    fill="#4f5d82"
                    fontSize="11.5"
                    fontWeight="600"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="font-mono"
                  >
                    {feed.amountMl}
                  </text>
                </g>
              ))}

              <g transform="translate(150, 930)">
                <rect width="260" height="92" rx="16" fill="#fbf4e6" stroke="#d7c7a9" />
                <text x="18" y="24" fill="#6b5845" fontSize="10" className="font-mono">
                  AVERAGE BOTTLE
                </text>
                <text x="18" y="54" fill="#4f5d82" fontSize="26" className="font-serif">
                  {summary.averageMl} ml
                </text>
                <text x="18" y="78" fill="#6b5845" fontSize="10" className="font-mono">
                  TOTAL IN 24H
                </text>
                <text x="136" y="78" fill="#4f5d82" fontSize="18" className="font-serif">
                  {summary.totalMl} ml
                </text>
              </g>

              <g transform="translate(550, 930)">
                <rect width="260" height="92" rx="16" fill="#fbf4e6" stroke="#d7c7a9" />
                <text x="18" y="24" fill="#6b5845" fontSize="10" className="font-mono">
                  AVG INTERVAL
                </text>
                <text x="18" y="54" fill="#4f5d82" fontSize="26" className="font-serif">
                  {summary.averageIntervalLabel}
                </text>
                <text x="18" y="78" fill="#6b5845" fontSize="10" className="font-mono">
                  LONGEST GAP
                </text>
                <text x="136" y="78" fill="#4f5d82" fontSize="18" className="font-serif">
                  {summary.longestGapLabel}
                </text>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
