import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import {
  Layout,
  Layouts,
  Responsive,
  ResponsiveProps,
  WidthProvider,
} from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "@/app/globals.css";
import { useLongPress, useMountedState } from "react-use";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

interface ResponsiveLayoutProps extends ResponsiveProps {
  className?: string;
  rowHeight?: number;
  onLayoutChange?: (layout: Layout[], layouts: Layouts) => void;
  cols?: {
    lg: number;
    md: number;
    sm: number;
    xs: number;
    xxs: number;
  };
  initialLayout?: Layout[];
  gridContent?: React.ReactNode[];
  compactType?: "horizontal" | "vertical" | null;
}

const generateLayout = (): Layout[] => {
  return _.map(_.range(0, 25), (item, i) => {
    const y = Math.ceil(Math.random() * 4) + 1;
    return {
      x: (_.random(0, 5) * 2) % 12,
      y: Math.floor(i / 6) * y,
      w: 2,
      h: y,
      i: i.toString(),
      static: Math.random() < 0.05,
    };
  });
};

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  className = "layout",
  rowHeight = 30,
  onLayoutChange: handleLayoutChange = () => {},
  cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
  initialLayout = generateLayout(),
  gridContent,
  compactType: compact = null,
  ...rest
}) => {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<string>("lg");
  const [compactType, setCompactType] = useState<
    "horizontal" | "vertical" | null
  >(compact);
  const [layouts, setLayouts] = useState<Layouts>({ lg: initialLayout });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const isMounted = useMountedState();

  useEffect(() => {
    console.log("isDragging", isDragging);
  }, [isDragging]);

  const onLongPress = () => {
    setIsDragging(true);
  };

  const longPressEvents = useLongPress(onLongPress, {
    isPreventDefault: false,
    delay: 300,
  });

  const onBreakpointChange = useCallback((breakpoint: string) => {
    setCurrentBreakpoint(breakpoint);
  }, []);

  const onLayoutChange = useCallback(
    (layout: Layout[], layouts: Layouts) => {
      handleLayoutChange(layout, layouts);
    },
    [handleLayoutChange],
  );

  const generateDOM = () => {
    return _.map(layouts.lg, (l, i) => {
      if (!gridContent) {
        return (
          <div key={i} className={l.static ? "static" : ""}>
            {l.static ? (
              <span
                className="text"
                title="This item is static and cannot be removed or resized."
              >
                Static - {i}
              </span>
            ) : (
              <span className="text">{i}</span>
            )}
          </div>
        );
      }
      return (
        <div key={i} className={l.static ? "static" : ""}>
          {gridContent[i] || <span className="text">{i}</span>}
        </div>
      );
    });
  };

  return (
    <div className={"w-full"} {...longPressEvents}>
      <ResponsiveReactGridLayout
        {...rest}
        className={className}
        rowHeight={rowHeight}
        layouts={layouts}
        onBreakpointChange={onBreakpointChange}
        onLayoutChange={onLayoutChange}
        measureBeforeMount={false}
        useCSSTransforms={isMounted()}
        compactType={compactType}
        cols={cols}
        isDraggable={isDragging}
        onDragStop={() => setIsDragging(false)}
      >
        {generateDOM()}
      </ResponsiveReactGridLayout>
    </div>
  );
};

ResponsiveLayout.propTypes = {
  onLayoutChange: PropTypes.func.isRequired,
};
