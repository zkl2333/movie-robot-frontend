import React, { useRef, useState, useEffect, useCallback, memo } from "react";
import Prism from "prismjs";
import { areEqual } from "react-window";
import "prismjs/components/prism-log.min.js";
import "prismjs/themes/prism-twilight.min.css";

Prism.languages.log.reason = {
  pattern:
    /「(.*?)」|(是个)?\s*全集种子.+需要预分析可靠性.+|影视类型不等于.+|(解析到的.+)?\s*不符合.+|自动解析后.+不符合.+|解析.+不符合.+|过滤前.+过滤后.+|不包含设定的关键字\(.+\)|与.+不一致，跳过|解析季度为|用.+规则排序|特别优先关键字|没找到.+描述|已经提交下载|Plex Sort Out|Success!/,
  greedy: true,
};
Prism.languages.log.site = {
  pattern:
    /ttg|HDHome|ssd|acgrip|audiences|beitai|btschool|chdbits|discfan|eastgame|exoticaz|filelist|gainbound|hares|hd4fans|hdarea|hdatmos|hdchina|hddolby|hdfans|hdhome|hdsky|hdtime|hdzone|iptorrents|joyhd|keepfrds|lemonhd|mikanani|mteam|nailuo|ourbits|pterclub|pthome|ptmsg|ptsbao|pttime|putao|rarbg|soulvoice|springsunday|tccf|tjupt|totheglory|U2/,
  greedy: true,
};
Prism.languages.log.special = {
  pattern:
    /object.+no.+|http.+Error|anyio.+Error|Connect.+Error|timed out|All.+failed|Connect.+failed|Cannot.+|Errno \d+|No such process/,
  greedy: true,
};

const RowLog = ({ index, setItemSize, data, style }) => {
  const rowLog = data[index];
  const [rowHtml, setRowHtml] = useState("");
  const [logLevel, setLogLevel] = useState("none");
  const itemRef = useRef();

  const requestAnimationFrameRef = useRef();

  const highlight = useCallback(() => {
    requestAnimationFrameRef.current = requestAnimationFrame(() => {
      const rowHtml = Prism.highlight(rowLog, Prism.languages.log, "log");
      // 根据class名字获取日志等级
      const isInfo = rowHtml.includes('class="token level info');
      const isWarning = rowHtml.includes('class="token level warning');
      const isError = rowHtml.includes('class="token level error');
      const logLevel = isError ? "error" : isWarning ? "warning" : isInfo ? "info" : "none";
      setRowHtml(rowHtml);
      setLogLevel(logLevel);
    });
  }, [rowLog]);

  // 根据日志等级高亮日志
  useEffect(() => {
    if (!itemRef.current) return;
    if (rowHtml !== "") return;

    // 当前元素可见时才高亮
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          highlight();
        }
      },
      {
        rootMargin: "100px",
        threshold: 0,
      }
    );
    observer.observe(itemRef.current);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(requestAnimationFrameRef.current);
    };
  }, [highlight, index, rowHtml, rowLog]);

  // 获取每一行日志的高度
  useEffect(() => {
    if (itemRef.current) {
      const elementHeight = itemRef.current.offsetHeight;
      setItemSize(index, elementHeight);
    }
  }, [index, setItemSize, rowHtml]);

  return (
    <div ref={itemRef} className={index % 2 ? "ListItemOdd" : "ListItemEven"}>
      <code
        className={`language-log ${logLevel}`}
        key={index}
        data-index={index}
        style={{
          whiteSpace: "pre-wrap",
          border: "unset",
          borderRadius: "unset",
          boxShadow: "unset",
          padding: "unset",
          background: "unset",
          wordBreak: "break-all",
          ...style,
        }}
      >
        {!rowHtml ? rowLog : <span dangerouslySetInnerHTML={{ __html: rowHtml }} />}
      </code>
    </div>
  );
};

export default memo(RowLog, areEqual);
