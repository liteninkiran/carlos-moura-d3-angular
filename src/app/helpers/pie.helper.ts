import { IPieData } from '../interfaces/chart.interfaces';
import * as d3 from 'd3';

export class PieHelper {
    static convert(data: any, title: string, valueAttr: string, idAttr: string, labelAttr: string): IPieData {

        const pieData = (data || []).map((elem) => ({
            id: elem[idAttr],
            label: elem[labelAttr],
            value: elem[valueAttr],
        }));

        return {
            title,
            data: pieData,
        }
    }

    static ExtendPreviousDataWithEnter = (previous, current) => {
        const previousIds = new Set(previous.map((d) => d.data.id));
        const beforeEndAngle = (id) => previous.find((d) => d.data.id === id)?.endAngle || 0;
        const newElements = current.filter((elem) => !previousIds.has(elem.data.id)).map((elem) => {
            const before = current.find((d) => d.index === elem.index - 1);
            const angle = beforeEndAngle(before?.data?.id);
            return {
                ...elem,
                startAngle: angle,
                endAngle: angle,
            };
        });
        return [...previous, ...newElements];
    }

    static ExtendCurrentDataWithExit = (previous, current) => {
        return PieHelper.ExtendPreviousDataWithEnter(current, previous);
    }

    static ArcTweenFactory = (data, enter: boolean, arc) => {
        const arcTween = function (elementData) {
            const previousElemData = data.find((d) => d.data.id === elementData.data.id);
            const [start, end] = enter ? [previousElemData, elementData] : [elementData, previousElemData];
            const interpolate = d3.interpolate(start, end);
            return function (t) {
                return arc(interpolate(t));
            }
        }
        return arcTween;
    }
}
