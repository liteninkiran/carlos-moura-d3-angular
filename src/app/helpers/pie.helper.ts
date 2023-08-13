import { IPieData } from '../interfaces/chart.interfaces';
import * as d3 from 'd3';

export class PieHelper {
    static convert(data: any, title: string, valueAttr: string, idAttr: string, labelAttr: string): IPieData {

        const pieData = (data || []).map((elem: any) => ({
            id: elem[idAttr],
            label: elem[labelAttr],
            value: elem[valueAttr],
        }));

        return {
            title,
            data: pieData,
        }
    }

    static ExtendPreviousDataWithEnter = (previous: any, current: any) => {
        const previousIds = new Set(previous.map((d: any) => d.data.id));
        const beforeEndAngle = (id: any) => previous.find((d: any) => d.data.id === id)?.endAngle || 0;
        const newElements = current.filter((elem: any) => !previousIds.has(elem.data.id)).map((elem: any) => {
            const before = current.find((d: any) => d.index === elem.index - 1);
            const angle = beforeEndAngle(before?.data?.id);
            return {
                ...elem,
                startAngle: angle,
                endAngle: angle,
            };
        });
        return [...previous, ...newElements];
    }

    static ExtendCurrentDataWithExit = (previous: any, current: any) => {
        return PieHelper.ExtendPreviousDataWithEnter(current, previous);
    }

    static ArcTweenFactory = (data: any, enter: boolean, arc: any) => {
        const arcTween = function (elementData: any) {
            const previousElemData = data.find((d: any) => d.data.id === elementData.data.id);
            const [start, end] = enter ? [previousElemData, elementData] : [elementData, previousElemData];
            const interpolate = d3.interpolate(start, end);
            return function (t: any) {
                return arc(interpolate(t));
            }
        }
        return arcTween;
    }
}
