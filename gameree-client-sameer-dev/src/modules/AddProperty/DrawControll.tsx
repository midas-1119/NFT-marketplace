import MapboxDraw from '@mapbox/mapbox-gl-draw';
import {useControl} from 'react-map-gl';

import type {MapRef, ControlPosition} from 'react-map-gl';

type DrawControlProps = ConstructorParameters<typeof MapboxDraw>[0] & {
  position?: ControlPosition;

  onCreate?: (evt: {features: object[]}) => void;
  onUpdate?: (evt: {features: object[]; action: string}) => void;
  onDelete?: (evt: {features: object[]}) => void;
};

export default function DrawControl(props: DrawControlProps) {
  useControl<MapboxDraw>(
    () => new MapboxDraw(props),
    ({map}: {map: MapRef}) => {
        //@ts-ignore
      map.on('draw.create', props.onCreate);
      //@ts-ignore
      map.on('draw.update', props.onUpdate);
      //@ts-ignore
      map.on('draw.delete', props.onDelete);
    },
    ({map}: {map: MapRef}) => {
        //@ts-ignore
      map.off('draw.create', props.onCreate);
      //@ts-ignore
      map.off('draw.update', props.onUpdate);
      //@ts-ignore
      map.off('draw.delete', props.onDelete);
    },
    {
      position: props.position
    }
  );

  return null;
}

DrawControl.defaultProps = {
  onCreate: () => {},
  onUpdate: () => {},
  onDelete: () => {}
};